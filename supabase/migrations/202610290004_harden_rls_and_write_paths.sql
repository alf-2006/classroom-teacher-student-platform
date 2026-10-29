-- Security hardening after ACL and policy review.
-- Predicate functions are intentionally callable by authenticated RLS evaluation,
-- while high-impact mutations are reserved for server/RPC paths.

grant execute on function public.is_teacher(uuid),
  public.owns_class(uuid, uuid),
  public.is_active_class_member(uuid, uuid),
  public.owns_assignment(uuid, uuid),
  public.owns_quiz(uuid, uuid)
  to authenticated;

-- A teacher may only publish content into classes they own.
drop policy if exists assignment_classes_write on public.assignment_classes;
create policy assignment_classes_write on public.assignment_classes
for all to authenticated
using (public.owns_assignment(assignment_id) and public.owns_class(class_id))
with check (public.owns_assignment(assignment_id) and public.owns_class(class_id));

drop policy if exists quiz_classes_manage on public.quiz_classes;
create policy quiz_classes_manage on public.quiz_classes
for all to authenticated
using (public.owns_quiz(quiz_id) and public.owns_class(class_id))
with check (public.owns_quiz(quiz_id) and public.owns_class(class_id));

-- Suspended accounts and non-student roles cannot consume student invitations.
create or replace function public.join_class_from_invite(raw_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_row public.class_invites%rowtype;
  class_row public.classes%rowtype;
  existing_membership public.class_memberships%rowtype;
  active_count integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'student' and p.status = 'active'
  ) then
    raise exception 'student_account_required';
  end if;

  if char_length(coalesce(raw_token, '')) < 32 then
    raise exception 'invalid_invite';
  end if;

  select * into invite_row
  from public.class_invites
  where token_hash = encode(digest(raw_token, 'sha256'), 'hex')
  for update;
  if not found then raise exception 'invalid_invite'; end if;

  select * into class_row from public.classes where id = invite_row.class_id for update;
  if invite_row.status <> 'active' or class_row.status <> 'active' then raise exception 'invite_unavailable'; end if;

  if invite_row.expires_at is not null and invite_row.expires_at <= now() then
    update public.class_invites set status = 'expired' where id = invite_row.id;
    raise exception 'invite_expired';
  end if;

  select * into existing_membership
  from public.class_memberships
  where class_id = invite_row.class_id and student_id = auth.uid()
  for update;

  if found and existing_membership.status = 'active' then return invite_row.class_id; end if;
  if invite_row.max_uses is not null and invite_row.uses_count >= invite_row.max_uses then
    update public.class_invites set status = 'exhausted' where id = invite_row.id;
    raise exception 'invite_exhausted';
  end if;

  select count(*) into active_count
  from public.class_memberships
  where class_id = invite_row.class_id and status = 'active';
  if active_count >= class_row.capacity then raise exception 'class_full'; end if;

  if found then
    update public.class_memberships
    set status = 'active', left_at = null, moved_to_class_id = null, joined_at = now()
    where id = existing_membership.id;
  else
    insert into public.class_memberships (class_id, student_id) values (invite_row.class_id, auth.uid());
  end if;

  update public.class_invites
  set uses_count = uses_count + 1,
      status = case when max_uses is not null and uses_count + 1 >= max_uses then 'exhausted' else 'active' end
  where id = invite_row.id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'class.joined_from_invite', 'class', invite_row.class_id, jsonb_build_object('invite_id', invite_row.id));

  return invite_row.class_id;
end;
$$;

-- Until server-side RPCs exist for these workflows, deny direct client mutation.
revoke insert, update, delete on public.class_memberships, public.class_invites,
  public.submissions, public.submission_versions, public.submission_files,
  public.assignment_grades, public.quiz_attempts, public.quiz_answers,
  public.ai_grading_jobs, public.student_notes, public.audit_logs
  from authenticated;

-- Students must never be able to change attempt state or score fields directly.
drop policy if exists attempts_insert on public.quiz_attempts;
drop policy if exists attempts_update on public.quiz_attempts;
drop policy if exists answers_write on public.quiz_answers;

-- Owners must be active teachers for owner-visible content.
drop policy if exists classes_select on public.classes;
create policy classes_select on public.classes for select to authenticated using (
  (owner_teacher_id = auth.uid() and public.is_teacher()) or public.is_active_class_member(id)
);
drop policy if exists assignments_select on public.assignments;
create policy assignments_select on public.assignments for select to authenticated using (
  (owner_teacher_id = auth.uid() and public.is_teacher())
  or (status = 'published' and exists (
    select 1 from public.assignment_classes ac
    where ac.assignment_id = assignments.id and public.is_active_class_member(ac.class_id)
  ))
);
drop policy if exists quizzes_select on public.quizzes;
create policy quizzes_select on public.quizzes for select to authenticated using (
  (owner_teacher_id = auth.uid() and public.is_teacher())
  or (status = 'published' and exists (
    select 1 from public.quiz_classes qc
    where qc.quiz_id = quizzes.id and public.is_active_class_member(qc.class_id)
  ))
);
