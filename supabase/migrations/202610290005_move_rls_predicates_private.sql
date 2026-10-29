-- Keep RLS predicate helpers out of the PostgREST-exposed public schema.
-- Moving a function preserves its OID, so existing policy dependencies continue to work.

create schema if not exists private;

alter function public.is_teacher(uuid) set schema private;
alter function public.owns_class(uuid, uuid) set schema private;
alter function public.is_active_class_member(uuid, uuid) set schema private;
alter function public.owns_assignment(uuid, uuid) set schema private;
alter function public.owns_quiz(uuid, uuid) set schema private;

grant usage on schema private to authenticated;
revoke all on function private.is_teacher(uuid), private.owns_class(uuid, uuid),
  private.is_active_class_member(uuid, uuid), private.owns_assignment(uuid, uuid),
  private.owns_quiz(uuid, uuid)
  from public, anon;
grant execute on function private.is_teacher(uuid), private.owns_class(uuid, uuid),
  private.is_active_class_member(uuid, uuid), private.owns_assignment(uuid, uuid),
  private.owns_quiz(uuid, uuid)
  to authenticated;
