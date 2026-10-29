-- Classroom platform: RLS, secure domain functions, and private storage authorization.

create or replace function public.is_teacher(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id and p.role = 'teacher' and p.status = 'active'
  );
$$;

create or replace function public.owns_class(target_class_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes c
    where c.id = target_class_id
      and c.owner_teacher_id = user_id
      and public.is_teacher(user_id)
  );
$$;

create or replace function public.is_active_class_member(target_class_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_memberships cm
    join public.profiles p on p.id = cm.student_id
    where cm.class_id = target_class_id
      and cm.student_id = user_id
      and cm.status = 'active'
      and p.status = 'active'
  );
$$;

create or replace function public.owns_assignment(target_assignment_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignments a
    where a.id = target_assignment_id
      and a.owner_teacher_id = user_id
      and public.is_teacher(user_id)
  );
$$;

create or replace function public.owns_quiz(target_quiz_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.quizzes q
    where q.id = target_quiz_id
      and q.owner_teacher_id = user_id
      and public.is_teacher(user_id)
  );
$$;

create or replace function public.update_my_display_name(next_display_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if char_length(trim(coalesce(next_display_name, ''))) not between 2 and 120 then
    raise exception 'invalid_display_name';
  end if;

  update public.profiles
  set display_name = trim(next_display_name)
  where id = auth.uid();
end;
$$;

create or replace function public.create_class_invite(
  target_class_id uuid,
  invite_expires_at timestamptz default null,
  invite_max_uses integer default null
)
returns table(invite_id uuid, token text, class_id uuid, expires_at timestamptz, max_uses integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_token text;
  row_id uuid;
begin
  if not public.owns_class(target_class_id) then
    raise exception 'not_authorized';
  end if;

  if invite_expires_at is not null and invite_expires_at <= now() then
    raise exception 'invite_expiration_must_be_future';
  end if;

  if invite_max_uses is not null and invite_max_uses <= 0 then
    raise exception 'invite_max_uses_must_be_positive';
  end if;

  raw_token := encode(gen_random_bytes(32), 'hex');

  insert into public.class_invites (class_id, created_by, token_hash, expires_at, max_uses)
  values (
    target_class_id,
    auth.uid(),
    encode(digest(raw_token, 'sha256'), 'hex'),
    invite_expires_at,
    invite_max_uses
  )
  returning id into row_id;

  return query
  select row_id, raw_token, target_class_id, invite_expires_at, invite_max_uses;
end;
$$;

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

  if char_length(coalesce(raw_token, '')) < 32 then
    raise exception 'invalid_invite';
  end if;

  select *
  into invite_row
  from public.class_invites
  where token_hash = encode(digest(raw_token, 'sha256'), 'hex')
  for update;

  if not found then
    raise exception 'invalid_invite';
  end if;

  select *
  into class_row
  from public.classes
  where id = invite_row.class_id
  for update;

  if invite_row.status <> 'active' or class_row.status <> 'active' then
    raise exception 'invite_unavailable';
  end if;

  if invite_row.expires_at is not null and invite_row.expires_at <= now() then
    update public.class_invites set status = 'expired' where id = invite_row.id;
    raise exception 'invite_expired';
  end if;

  select *
  into existing_membership
  from public.class_memberships
  where class_id = invite_row.class_id and student_id = auth.uid()
  for update;

  if found and existing_membership.status = 'active' then
    return invite_row.class_id;
  end if;

  if invite_row.max_uses is not null and invite_row.uses_count >= invite_row.max_uses then
    update public.class_invites set status = 'exhausted' where id = invite_row.id;
    raise exception 'invite_exhausted';
  end if;

  select count(*)
  into active_count
  from public.class_memberships
  where class_id = invite_row.class_id and status = 'active';

  if active_count >= class_row.capacity then
    raise exception 'class_full';
  end if;

  if found then
    update public.class_memberships
    set status = 'active', left_at = null, moved_to_class_id = null, joined_at = now()
    where id = existing_membership.id;
  else
    insert into public.class_memberships (class_id, student_id)
    values (invite_row.class_id, auth.uid());
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

create or replace function public.get_quiz_for_student(target_quiz_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_quiz public.quizzes%rowtype;
  result jsonb;
begin
  select *
  into target_quiz
  from public.quizzes
  where id = target_quiz_id;

  if not found or target_quiz.status <> 'published' or target_quiz.current_published_version_id is null then
    raise exception 'quiz_unavailable';
  end if;

  if not exists (
    select 1
    from public.quiz_classes qc
    where qc.quiz_id = target_quiz_id
      and public.is_active_class_member(qc.class_id)
  ) then
    raise exception 'not_authorized';
  end if;

  select jsonb_build_object(
    'id', target_quiz.id,
    'title', target_quiz.title,
    'description', target_quiz.description,
    'settings', target_quiz.settings,
    'versionId', target_quiz.current_published_version_id,
    'questions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', question.id,
          'position', question.position,
          'type', question.type,
          'text', question.text,
          'points', question.points,
          'options', case when question.type = 'mcq' then coalesce((
            select jsonb_agg(jsonb_build_object('id', option_row.id, 'position', option_row.position, 'text', option_row.text) order by option_row.position)
            from public.quiz_question_options option_row
            where option_row.question_id = question.id
          ), '[]'::jsonb) else '[]'::jsonb end
        )
        order by question.position
      )
      from public.quiz_questions question
      where question.quiz_version_id = target_quiz.current_published_version_id
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.classes, public.class_memberships, public.assignments, public.assignment_classes,
  public.submissions, public.submission_versions, public.submission_files, public.assignment_grades,
  public.quizzes, public.quiz_attempts, public.quiz_answers, public.ai_grading_jobs, public.notifications
  to authenticated;
grant insert, update on public.classes, public.class_memberships, public.class_invites,
  public.assignments, public.assignment_classes, public.submissions, public.submission_versions,
  public.submission_files, public.assignment_grades, public.quizzes, public.quiz_versions,
  public.quiz_classes, public.quiz_questions, public.quiz_question_options, public.quiz_attempts,
  public.quiz_answers, public.ai_grading_jobs, public.student_notes, public.audit_logs, public.notifications
  to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function public.update_my_display_name(text), public.create_class_invite(uuid, timestamptz, integer),
  public.join_class_from_invite(text), public.get_quiz_for_student(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.class_invites enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_classes enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_versions enable row level security;
alter table public.submission_files enable row level security;
alter table public.assignment_grades enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_versions enable row level security;
alter table public.quiz_classes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_question_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.ai_provider_configs enable row level security;
alter table public.ai_grading_jobs enable row level security;
alter table public.student_notes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

create policy profiles_select on public.profiles for select to authenticated using (
  id = auth.uid()
  or exists (
    select 1
    from public.classes c
    join public.class_memberships cm on cm.class_id = c.id
    where c.owner_teacher_id = auth.uid() and cm.student_id = profiles.id
  )
);

create policy classes_select on public.classes for select to authenticated using (
  owner_teacher_id = auth.uid() or public.is_active_class_member(id)
);
create policy classes_insert on public.classes for insert to authenticated with check (
  owner_teacher_id = auth.uid() and public.is_teacher()
);
create policy classes_update on public.classes for update to authenticated using (
  owner_teacher_id = auth.uid() and public.is_teacher()
) with check (
  owner_teacher_id = auth.uid() and public.is_teacher()
);

create policy memberships_select on public.class_memberships for select to authenticated using (
  student_id = auth.uid() or public.owns_class(class_id)
);
create policy memberships_write on public.class_memberships for all to authenticated using (
  public.owns_class(class_id)
) with check (
  public.owns_class(class_id)
);
create policy invites_manage on public.class_invites for all to authenticated using (
  public.owns_class(class_id)
) with check (
  public.owns_class(class_id)
);

create policy assignments_select on public.assignments for select to authenticated using (
  owner_teacher_id = auth.uid()
  or (status = 'published' and exists (
    select 1 from public.assignment_classes ac
    where ac.assignment_id = assignments.id and public.is_active_class_member(ac.class_id)
  ))
);
create policy assignments_write on public.assignments for all to authenticated using (
  owner_teacher_id = auth.uid() and public.is_teacher()
) with check (
  owner_teacher_id = auth.uid() and public.is_teacher()
);
create policy assignment_classes_select on public.assignment_classes for select to authenticated using (
  public.owns_assignment(assignment_id) or public.is_active_class_member(class_id)
);
create policy assignment_classes_write on public.assignment_classes for all to authenticated using (
  public.owns_assignment(assignment_id)
) with check (
  public.owns_assignment(assignment_id)
);

create policy submissions_select on public.submissions for select to authenticated using (
  student_id = auth.uid() or public.owns_assignment(assignment_id)
);
create policy submissions_insert on public.submissions for insert to authenticated with check (
  student_id = auth.uid() and exists (
    select 1
    from public.assignment_classes ac
    join public.assignments a on a.id = ac.assignment_id
    where ac.assignment_id = submissions.assignment_id
      and a.status = 'published'
      and public.is_active_class_member(ac.class_id)
  )
);
create policy submissions_update on public.submissions for update to authenticated using (
  student_id = auth.uid() or public.owns_assignment(assignment_id)
) with check (
  student_id = auth.uid() or public.owns_assignment(assignment_id)
);
create policy submission_versions_select on public.submission_versions for select to authenticated using (
  exists (
    select 1 from public.submissions s
    where s.id = submission_versions.submission_id
      and (s.student_id = auth.uid() or public.owns_assignment(s.assignment_id))
  )
);
create policy submission_versions_insert on public.submission_versions for insert to authenticated with check (
  exists (
    select 1 from public.submissions s
    where s.id = submission_versions.submission_id
      and s.student_id = auth.uid()
      and uploaded_by = auth.uid()
  )
);
create policy submission_files_select on public.submission_files for select to authenticated using (
  exists (
    select 1
    from public.submission_versions sv
    join public.submissions s on s.id = sv.submission_id
    where sv.id = submission_files.submission_version_id
      and (s.student_id = auth.uid() or public.owns_assignment(s.assignment_id))
  )
);
create policy submission_files_insert on public.submission_files for insert to authenticated with check (
  exists (
    select 1
    from public.submission_versions sv
    join public.submissions s on s.id = sv.submission_id
    where sv.id = submission_files.submission_version_id
      and s.student_id = auth.uid()
  )
);
create policy grades_select on public.assignment_grades for select to authenticated using (
  exists (
    select 1 from public.submissions s
    where s.id = assignment_grades.submission_id
      and (public.owns_assignment(s.assignment_id) or (s.student_id = auth.uid() and assignment_grades.published_at is not null))
  )
);
create policy grades_write on public.assignment_grades for all to authenticated using (
  exists (
    select 1 from public.submissions s
    where s.id = assignment_grades.submission_id and public.owns_assignment(s.assignment_id)
  )
) with check (
  exists (
    select 1 from public.submissions s
    where s.id = assignment_grades.submission_id and public.owns_assignment(s.assignment_id)
  )
);

create policy quizzes_select on public.quizzes for select to authenticated using (
  owner_teacher_id = auth.uid()
  or (status = 'published' and exists (
    select 1 from public.quiz_classes qc
    where qc.quiz_id = quizzes.id and public.is_active_class_member(qc.class_id)
  ))
);
create policy quizzes_write on public.quizzes for all to authenticated using (
  owner_teacher_id = auth.uid() and public.is_teacher()
) with check (
  owner_teacher_id = auth.uid() and public.is_teacher()
);
create policy quiz_versions_manage on public.quiz_versions for all to authenticated using (
  public.owns_quiz(quiz_id)
) with check (
  public.owns_quiz(quiz_id)
);
create policy quiz_classes_manage on public.quiz_classes for all to authenticated using (
  public.owns_quiz(quiz_id)
) with check (
  public.owns_quiz(quiz_id)
);
create policy questions_manage on public.quiz_questions for all to authenticated using (
  exists (
    select 1 from public.quiz_versions qv
    where qv.id = quiz_questions.quiz_version_id and public.owns_quiz(qv.quiz_id)
  )
) with check (
  exists (
    select 1 from public.quiz_versions qv
    where qv.id = quiz_questions.quiz_version_id and public.owns_quiz(qv.quiz_id)
  )
);
create policy options_manage on public.quiz_question_options for all to authenticated using (
  exists (
    select 1 from public.quiz_questions qq
    join public.quiz_versions qv on qv.id = qq.quiz_version_id
    where qq.id = quiz_question_options.question_id and public.owns_quiz(qv.quiz_id)
  )
) with check (
  exists (
    select 1 from public.quiz_questions qq
    join public.quiz_versions qv on qv.id = qq.quiz_version_id
    where qq.id = quiz_question_options.question_id and public.owns_quiz(qv.quiz_id)
  )
);

create policy attempts_select on public.quiz_attempts for select to authenticated using (
  student_id = auth.uid() or public.owns_quiz(quiz_id)
);
create policy attempts_insert on public.quiz_attempts for insert to authenticated with check (
  student_id = auth.uid() and exists (
    select 1 from public.quizzes q
    where q.id = quiz_attempts.quiz_id
      and q.status = 'published'
      and q.current_published_version_id = quiz_attempts.quiz_version_id
      and exists (
        select 1 from public.quiz_classes qc
        where qc.quiz_id = q.id and public.is_active_class_member(qc.class_id)
      )
  )
);
create policy attempts_update on public.quiz_attempts for update to authenticated using (
  student_id = auth.uid() or public.owns_quiz(quiz_id)
) with check (
  student_id = auth.uid() or public.owns_quiz(quiz_id)
);
create policy answers_select on public.quiz_answers for select to authenticated using (
  exists (
    select 1 from public.quiz_attempts qa
    where qa.id = quiz_answers.attempt_id
      and (qa.student_id = auth.uid() or public.owns_quiz(qa.quiz_id))
  )
);
create policy answers_write on public.quiz_answers for all to authenticated using (
  exists (
    select 1 from public.quiz_attempts qa
    where qa.id = quiz_answers.attempt_id
      and qa.student_id = auth.uid()
      and qa.status = 'in_progress'
  )
) with check (
  exists (
    select 1 from public.quiz_attempts qa
    where qa.id = quiz_answers.attempt_id
      and qa.student_id = auth.uid()
      and qa.status = 'in_progress'
  )
);

create policy ai_provider_configs_manage on public.ai_provider_configs for all to authenticated using (
  owner_teacher_id = auth.uid() and public.is_teacher()
) with check (
  owner_teacher_id = auth.uid() and public.is_teacher()
);
create policy ai_jobs_select on public.ai_grading_jobs for select to authenticated using (
  exists (
    select 1 from public.quiz_answers answer_row
    join public.quiz_attempts attempt_row on attempt_row.id = answer_row.attempt_id
    where answer_row.id = ai_grading_jobs.quiz_answer_id and public.owns_quiz(attempt_row.quiz_id)
  )
);
create policy ai_jobs_write on public.ai_grading_jobs for all to authenticated using (
  exists (
    select 1 from public.quiz_answers answer_row
    join public.quiz_attempts attempt_row on attempt_row.id = answer_row.attempt_id
    where answer_row.id = ai_grading_jobs.quiz_answer_id and public.owns_quiz(attempt_row.quiz_id)
  )
) with check (
  exists (
    select 1 from public.quiz_answers answer_row
    join public.quiz_attempts attempt_row on attempt_row.id = answer_row.attempt_id
    where answer_row.id = ai_grading_jobs.quiz_answer_id and public.owns_quiz(attempt_row.quiz_id)
  )
);
create policy notes_manage on public.student_notes for all to authenticated using (
  teacher_id = auth.uid() and public.is_teacher()
) with check (
  teacher_id = auth.uid() and public.is_teacher()
);
create policy audit_select_own on public.audit_logs for select to authenticated using (
  actor_id = auth.uid()
);
create policy audit_insert_self on public.audit_logs for insert to authenticated with check (
  actor_id = auth.uid()
);
create policy notifications_select on public.notifications for select to authenticated using (
  user_id = auth.uid()
);
create policy notifications_update on public.notifications for update to authenticated using (
  user_id = auth.uid()
) with check (
  user_id = auth.uid()
);

create policy private_submission_files_select on storage.objects for select to authenticated using (
  bucket_id = 'private-submissions'
  and exists (
    select 1
    from public.submission_files sf
    join public.submission_versions sv on sv.id = sf.submission_version_id
    join public.submissions s on s.id = sv.submission_id
    where sf.storage_path = storage.objects.name
      and (s.student_id = auth.uid() or public.owns_assignment(s.assignment_id))
  )
);
