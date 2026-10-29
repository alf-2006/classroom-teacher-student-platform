-- Classroom platform: initial schema, ownership boundaries, and RLS.
-- This migration is additive and is intended for a newly provisioned Supabase project.

create extension if not exists pgcrypto;

create type public.app_role as enum ('teacher', 'student');
create type public.account_status as enum ('active', 'suspended');
create type public.class_status as enum ('active', 'archived');
create type public.membership_status as enum ('active', 'removed', 'transferred');
create type public.invite_status as enum ('active', 'revoked', 'expired', 'exhausted');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.submission_status as enum ('submitted', 'reviewed', 'late', 'needs_revision');
create type public.question_type as enum ('mcq', 'true_false', 'essay');
create type public.attempt_status as enum ('in_progress', 'submitted', 'graded', 'review_required');
create type public.ai_provider as enum ('google_ai_studio', 'groq');
create type public.ai_job_status as enum ('pending', 'processing', 'graded', 'failed', 'review_required');
create type public.notification_kind as enum ('assignment', 'grade', 'quiz', 'system', 'invite');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  status public.account_status not null default 'active',
  display_name text not null default 'طالب جديد' check (char_length(trim(display_name)) between 2 and 120),
  phone_e164 text unique check (phone_e164 is null or phone_e164 ~ '^\\+[1-9][0-9]{6,14}$'),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  owner_teacher_id uuid not null references public.profiles(id) on delete restrict,
  name text not null check (char_length(trim(name)) between 2 and 160),
  description text,
  capacity integer not null default 30 check (capacity between 1 and 10000),
  status public.class_status not null default 'active',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'archived' and archived_at is not null) or (status = 'active' and archived_at is null))
);

create table public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,
  status public.membership_status not null default 'active',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  moved_to_class_id uuid references public.classes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, student_id),
  check ((status = 'active' and left_at is null) or (status <> 'active' and left_at is not null))
);

create table public.class_invites (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  token_hash text not null unique,
  status public.invite_status not null default 'active',
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  uses_count integer not null default 0 check (uses_count >= 0),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_uses is null or uses_count <= max_uses)
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  owner_teacher_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 2 and 240),
  details text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'published' and published_at is not null) or status <> 'published')
);

create table public.assignment_classes (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (assignment_id, class_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,
  status public.submission_status not null default 'submitted',
  current_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create table public.submission_versions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  uploaded_at timestamptz not null default now(),
  idempotency_key uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unique (submission_id, version_number),
  unique (idempotency_key)
);

alter table public.submissions
  add constraint submissions_current_version_fk
  foreign key (current_version_id) references public.submission_versions(id) on delete set null;

create table public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_version_id uuid not null references public.submission_versions(id) on delete cascade,
  storage_bucket text not null default 'private-submissions',
  storage_path text not null unique,
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 20971520),
  sha256 text,
  created_at timestamptz not null default now(),
  unique (submission_version_id)
);

create table public.assignment_grades (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  score numeric(7,2) not null check (score >= 0),
  max_score numeric(7,2) not null check (max_score > 0 and score <= max_score),
  feedback text,
  graded_by uuid not null references public.profiles(id) on delete restrict,
  reviewed_at timestamptz not null default now(),
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  owner_teacher_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 2 and 240),
  description text,
  status public.content_status not null default 'draft',
  settings jsonb not null default '{}'::jsonb,
  current_draft_version_id uuid,
  current_published_version_id uuid,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_versions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  status public.content_status not null default 'draft',
  title text not null check (char_length(trim(title)) between 2 and 240),
  description text,
  settings jsonb not null default '{}'::jsonb,
  snapshot jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.profiles(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (quiz_id, version_number)
);

alter table public.quizzes
  add constraint quizzes_draft_version_fk foreign key (current_draft_version_id) references public.quiz_versions(id) on delete set null,
  add constraint quizzes_published_version_fk foreign key (current_published_version_id) references public.quiz_versions(id) on delete set null;

create table public.quiz_classes (
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (quiz_id, class_id)
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_version_id uuid not null references public.quiz_versions(id) on delete cascade,
  position integer not null check (position >= 0),
  type public.question_type not null,
  text text not null check (char_length(trim(text)) between 1 and 10000),
  points numeric(7,2) not null check (points > 0 and points <= 100000),
  correct_option_ids uuid[] not null default '{}',
  correct_boolean boolean,
  model_answer text,
  rubric jsonb not null default '[]'::jsonb,
  explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quiz_version_id, position),
  check (
    (type = 'mcq' and cardinality(correct_option_ids) >= 1 and correct_boolean is null)
    or (type = 'true_false' and correct_boolean is not null and cardinality(correct_option_ids) = 0)
    or (type = 'essay' and correct_boolean is null and cardinality(correct_option_ids) = 0)
  )
);

create table public.quiz_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  position integer not null check (position >= 0),
  text text not null check (char_length(trim(text)) between 1 and 4000),
  created_at timestamptz not null default now(),
  unique (question_id, position)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete restrict,
  quiz_version_id uuid not null references public.quiz_versions(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,
  status public.attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  server_deadline_at timestamptz,
  objective_score numeric(7,2) not null default 0 check (objective_score >= 0),
  total_score numeric(7,2) not null default 0 check (total_score >= 0),
  max_score numeric(7,2) not null default 0 check (max_score >= 0),
  result_published_at timestamptz,
  idempotency_key uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (idempotency_key)
);

create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete restrict,
  selected_option_ids uuid[] not null default '{}',
  boolean_answer boolean,
  essay_answer text,
  score numeric(7,2) not null default 0 check (score >= 0),
  max_score numeric(7,2) not null default 0 check (max_score >= 0),
  grading_feedback text,
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table public.ai_provider_configs (
  id uuid primary key default gen_random_uuid(),
  owner_teacher_id uuid not null references public.profiles(id) on delete cascade,
  provider public.ai_provider not null,
  endpoint text,
  encrypted_api_key text not null,
  key_fingerprint text not null,
  selected_model_id text,
  model_capabilities jsonb not null default '{}'::jsonb,
  last_tested_at timestamptz,
  last_test_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_teacher_id, provider)
);

create table public.ai_grading_jobs (
  id uuid primary key default gen_random_uuid(),
  quiz_answer_id uuid not null unique references public.quiz_answers(id) on delete cascade,
  provider_config_id uuid not null references public.ai_provider_configs(id) on delete restrict,
  status public.ai_job_status not null default 'pending',
  idempotency_key uuid not null unique default gen_random_uuid(),
  attempt_count integer not null default 0 check (attempt_count >= 0 and attempt_count <= 8),
  leased_until timestamptz,
  next_retry_at timestamptz,
  proposed_score numeric(7,2) check (proposed_score >= 0),
  max_score numeric(7,2) not null check (max_score > 0),
  rationale jsonb not null default '{}'::jsonb,
  provider_model_id text,
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.student_notes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,
  note text not null check (char_length(trim(note)) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (char_length(action) between 3 and 160),
  entity_type text not null check (char_length(entity_type) between 2 and 100),
  entity_id uuid,
  request_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind public.notification_kind not null,
  title text not null check (char_length(trim(title)) between 1 and 180),
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Query-path indexes.
create index classes_owner_status_idx on public.classes(owner_teacher_id, status);
create index class_memberships_student_status_idx on public.class_memberships(student_id, status);
create index class_memberships_class_status_idx on public.class_memberships(class_id, status);
create index class_invites_class_status_idx on public.class_invites(class_id, status);
create index assignments_owner_status_idx on public.assignments(owner_teacher_id, status);
create index assignment_classes_class_idx on public.assignment_classes(class_id);
create index submissions_assignment_idx on public.submissions(assignment_id);
create index submissions_student_idx on public.submissions(student_id);
create index submission_versions_submission_idx on public.submission_versions(submission_id, version_number desc);
create index quiz_versions_quiz_idx on public.quiz_versions(quiz_id, version_number desc);
create index quiz_classes_class_idx on public.quiz_classes(class_id);
create index quiz_questions_version_idx on public.quiz_questions(quiz_version_id, position);
create index quiz_attempts_student_quiz_idx on public.quiz_attempts(student_id, quiz_id, started_at desc);
create index quiz_attempts_quiz_idx on public.quiz_attempts(quiz_id, status);
create index ai_grading_jobs_status_retry_idx on public.ai_grading_jobs(status, next_retry_at);
create index student_notes_student_idx on public.student_notes(student_id, created_at desc);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);
create index notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);

-- Updated-at timestamps.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger classes_set_updated_at before update on public.classes for each row execute function public.set_updated_at();
create trigger memberships_set_updated_at before update on public.class_memberships for each row execute function public.set_updated_at();
create trigger invites_set_updated_at before update on public.class_invites for each row execute function public.set_updated_at();
create trigger assignments_set_updated_at before update on public.assignments for each row execute function public.set_updated_at();
create trigger submissions_set_updated_at before update on public.submissions for each row execute function public.set_updated_at();
create trigger grades_set_updated_at before update on public.assignment_grades for each row execute function public.set_updated_at();
create trigger quizzes_set_updated_at before update on public.quizzes for each row execute function public.set_updated_at();
create trigger questions_set_updated_at before update on public.quiz_questions for each row execute function public.set_updated_at();
create trigger attempts_set_updated_at before update on public.quiz_attempts for each row execute function public.set_updated_at();
create trigger providers_set_updated_at before update on public.ai_provider_configs for each row execute function public.set_updated_at();
create trigger jobs_set_updated_at before update on public.ai_grading_jobs for each row execute function public.set_updated_at();
create trigger notes_set_updated_at before update on public.student_notes for each row execute function public.set_updated_at();

-- A profile is created only by the auth trigger. The client cannot supply role.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, status, display_name, phone_e164)
  values (
    new.id,
    'student',
    'active',
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'طالب جديد'),
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- Security-definer predicates avoid recursive RLS checks and centralize relationship logic.
create or replace function public.is_teacher(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
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
    select 1 from public.classes c
    where c.id = target_class_id and c.owner_teacher_id = user_id and public.is_teacher(user_id)
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
    select 1 from public.class_memberships cm
    where cm.class_id = target_class_id and cm.student_id = user_id and cm.status = 'active'
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
    select 1 from public.assignments a
    where a.id = target_assignment_id and a.owner_teacher_id = user_id and public.is_teacher(user_id)
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
    select 1 from public.quizzes q
    where q.id = target_quiz_id and q.owner_teacher_id = user_id and public.is_teacher(user_id)
  );
$$;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.classes, public.class_memberships, public.assignments, public.assignment_classes,
  public.submissions, public.submission_versions, public.submission_files, public.assignment_grades,
  public.quizzes, public.quiz_versions, public.quiz_classes, public.quiz_questions, public.quiz_question_options,
  public.quiz_attempts, public.quiz_answers, public.ai_grading_jobs, public.notifications to authenticated;
grant insert, update on public.classes, public.class_memberships, public.class_invites, public.assignments, public.assignment_classes,
  public.submissions, public.submission_versions, public.submission_files, public.assignment_grades,
  public.quizzes, public.quiz_versions, public.quiz_classes, public.quiz_questions, public.quiz_question_options,
  public.quiz_attempts, public.quiz_answers, public.ai_provider_configs, public.ai_grading_jobs,
  public.student_notes, public.audit_logs, public.notifications to authenticated;
grant usage, select on all sequences in schema public to authenticated;

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
    select 1 from public.classes c
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
create policy classes_update on public.classes for update to authenticated using (owner_teacher_id = auth.uid() and public.is_teacher()) with check (owner_teacher_id = auth.uid() and public.is_teacher());

create policy memberships_select on public.class_memberships for select to authenticated using (
  student_id = auth.uid() or public.owns_class(class_id)
);
create policy memberships_write on public.class_memberships for all to authenticated using (public.owns_class(class_id)) with check (public.owns_class(class_id));

create policy invites_manage on public.class_invites for all to authenticated using (public.owns_class(class_id)) with check (public.owns_class(class_id));

create policy assignments_select on public.assignments for select to authenticated using (
  owner_teacher_id = auth.uid()
  or (status = 'published' and exists (
    select 1 from public.assignment_classes ac where ac.assignment_id = assignments.id and public.is_active_class_member(ac.class_id)
  ))
);
create policy assignments_write on public.assignments for all to authenticated using (owner_teacher_id = auth.uid() and public.is_teacher()) with check (owner_teacher_id = auth.uid() and public.is_teacher());

create policy assignment_classes_select on public.assignment_classes for select to authenticated using (
  public.owns_assignment(assignment_id) or public.is_active_class_member(class_id)
);
create policy assignment_classes_write on public.assignment_classes for all to authenticated using (public.owns_assignment(assignment_id)) with check (public.owns_assignment(assignment_id));

create policy submissions_select on public.submissions for select to authenticated using (
  student_id = auth.uid() or public.owns_assignment(assignment_id)
);
create policy submissions_insert on public.submissions for insert to authenticated with check (student_id = auth.uid() and exists (
  select 1 from public.assignment_classes ac join public.assignments a on a.id = ac.assignment_id
  where ac.assignment_id = submissions.assignment_id and a.status = 'published' and public.is_active_class_member(ac.class_id)
));
create policy submissions_update on public.submissions for update to authenticated using (student_id = auth.uid() or public.owns_assignment(assignment_id)) with check (student_id = auth.uid() or public.owns_assignment(assignment_id));

create policy submission_versions_select on public.submission_versions for select to authenticated using (exists (
  select 1 from public.submissions s where s.id = submission_versions.submission_id and (s.student_id = auth.uid() or public.owns_assignment(s.assignment_id))
));
create policy submission_versions_insert on public.submission_versions for insert to authenticated with check (exists (
  select 1 from public.submissions s where s.id = submission_versions.submission_id and s.student_id = auth.uid() and uploaded_by = auth.uid()
));

create policy submission_files_select on public.submission_files for select to authenticated using (exists (
  select 1 from public.submission_versions sv join public.submissions s on s.id = sv.submission_id
  where sv.id = submission_files.submission_version_id and (s.student_id = auth.uid() or public.owns_assignment(s.assignment_id))
));
create policy submission_files_insert on public.submission_files for insert to authenticated with check (exists (
  select 1 from public.submission_versions sv join public.submissions s on s.id = sv.submission_id
  where sv.id = submission_files.submission_version_id and s.student_id = auth.uid()
));

create policy grades_select on public.assignment_grades for select to authenticated using (exists (
  select 1 from public.submissions s where s.id = assignment_grades.submission_id and (public.owns_assignment(s.assignment_id) or (s.student_id = auth.uid() and assignment_grades.published_at is not null))
));
create policy grades_write on public.assignment_grades for all to authenticated using (exists (
  select 1 from public.submissions s where s.id = assignment_grades.submission_id and public.owns_assignment(s.assignment_id)
)) with check (exists (
  select 1 from public.submissions s where s.id = assignment_grades.submission_id and public.owns_assignment(s.assignment_id)
));

create policy quizzes_select on public.quizzes for select to authenticated using (
  owner_teacher_id = auth.uid() or (status = 'published' and exists (
    select 1 from public.quiz_classes qc where qc.quiz_id = quizzes.id and public.is_active_class_member(qc.class_id)
  ))
);
create policy quizzes_write on public.quizzes for all to authenticated using (owner_teacher_id = auth.uid() and public.is_teacher()) with check (owner_teacher_id = auth.uid() and public.is_teacher());
create policy quiz_versions_select on public.quiz_versions for select to authenticated using (public.owns_quiz(quiz_id) or exists (
  select 1 from public.quizzes q where q.id = quiz_versions.quiz_id and q.current_published_version_id = quiz_versions.id and q.status = 'published' and exists (
    select 1 from public.quiz_classes qc where qc.quiz_id = q.id and public.is_active_class_member(qc.class_id)
  )
));
create policy quiz_versions_write on public.quiz_versions for all to authenticated using (public.owns_quiz(quiz_id)) with check (public.owns_quiz(quiz_id));
create policy quiz_classes_select on public.quiz_classes for select to authenticated using (public.owns_quiz(quiz_id) or public.is_active_class_member(class_id));
create policy quiz_classes_write on public.quiz_classes for all to authenticated using (public.owns_quiz(quiz_id)) with check (public.owns_quiz(quiz_id));
create policy questions_select on public.quiz_questions for select to authenticated using (exists (
  select 1 from public.quiz_versions qv where qv.id = quiz_questions.quiz_version_id and public.owns_quiz(qv.quiz_id)
));
create policy questions_write on public.quiz_questions for all to authenticated using (exists (select 1 from public.quiz_versions qv where qv.id = quiz_questions.quiz_version_id and public.owns_quiz(qv.quiz_id))) with check (exists (select 1 from public.quiz_versions qv where qv.id = quiz_questions.quiz_version_id and public.owns_quiz(qv.quiz_id)));
create policy options_select on public.quiz_question_options for select to authenticated using (exists (select 1 from public.quiz_questions qq join public.quiz_versions qv on qv.id = qq.quiz_version_id where qq.id = quiz_question_options.question_id and public.owns_quiz(qv.quiz_id)));
create policy options_write on public.quiz_question_options for all to authenticated using (exists (select 1 from public.quiz_questions qq join public.quiz_versions qv on qv.id = qq.quiz_version_id where qq.id = quiz_question_options.question_id and public.owns_quiz(qv.quiz_id))) with check (exists (select 1 from public.quiz_questions qq join public.quiz_versions qv on qv.id = qq.quiz_version_id where qq.id = quiz_question_options.question_id and public.owns_quiz(qv.quiz_id)));

create policy attempts_select on public.quiz_attempts for select to authenticated using (student_id = auth.uid() or public.owns_quiz(quiz_id));
create policy attempts_insert on public.quiz_attempts for insert to authenticated with check (student_id = auth.uid() and exists (select 1 from public.quizzes q where q.id = quiz_attempts.quiz_id and q.status = 'published' and q.current_published_version_id = quiz_attempts.quiz_version_id and exists (select 1 from public.quiz_classes qc where qc.quiz_id = q.id and public.is_active_class_member(qc.class_id))));
create policy attempts_update on public.quiz_attempts for update to authenticated using (student_id = auth.uid() or public.owns_quiz(quiz_id)) with check (student_id = auth.uid() or public.owns_quiz(quiz_id));
create policy answers_select on public.quiz_answers for select to authenticated using (exists (select 1 from public.quiz_attempts qa where qa.id = quiz_answers.attempt_id and (qa.student_id = auth.uid() or public.owns_quiz(qa.quiz_id))));
create policy answers_write on public.quiz_answers for all to authenticated using (exists (select 1 from public.quiz_attempts qa where qa.id = quiz_answers.attempt_id and qa.student_id = auth.uid() and qa.status = 'in_progress')) with check (exists (select 1 from public.quiz_attempts qa where qa.id = quiz_answers.attempt_id and qa.student_id = auth.uid() and qa.status = 'in_progress'));

create policy ai_provider_configs_manage on public.ai_provider_configs for all to authenticated using (owner_teacher_id = auth.uid() and public.is_teacher()) with check (owner_teacher_id = auth.uid() and public.is_teacher());
create policy ai_jobs_select on public.ai_grading_jobs for select to authenticated using (exists (select 1 from public.quiz_answers ans join public.quiz_attempts qa on qa.id = ans.attempt_id where ans.id = ai_grading_jobs.quiz_answer_id and public.owns_quiz(qa.quiz_id)));
create policy ai_jobs_write on public.ai_grading_jobs for all to authenticated using (exists (select 1 from public.quiz_answers ans join public.quiz_attempts qa on qa.id = ans.attempt_id where ans.id = ai_grading_jobs.quiz_answer_id and public.owns_quiz(qa.quiz_id))) with check (exists (select 1 from public.quiz_answers ans join public.quiz_attempts qa on qa.id = ans.attempt_id where ans.id = ai_grading_jobs.quiz_answer_id and public.owns_quiz(qa.quiz_id)));
create policy notes_manage on public.student_notes for all to authenticated using (teacher_id = auth.uid() and public.is_teacher()) with check (teacher_id = auth.uid() and public.is_teacher());
create policy audit_select on public.audit_logs for select to authenticated using (public.is_teacher());
create policy audit_insert on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());
create policy notifications_select on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notifications_update on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Private buckets are created in the migration. Object authorization is issued by server routes after domain authorization.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('private-submissions', 'private-submissions', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png']),
  ('private-quiz-imports', 'private-quiz-imports', false, 5242880, array['application/json'])
on conflict (id) do nothing;

create policy private_submission_files_select on storage.objects for select to authenticated using (
  bucket_id = 'private-submissions' and exists (
    select 1 from public.submission_files sf
    join public.submission_versions sv on sv.id = sf.submission_version_id
    join public.submissions s on s.id = sv.submission_id
    where sf.storage_path = storage.objects.name and (s.student_id = auth.uid() or public.owns_assignment(s.assignment_id))
  )
);

-- Server-side routes issue signed upload URLs; direct client writes to private buckets are intentionally denied.
