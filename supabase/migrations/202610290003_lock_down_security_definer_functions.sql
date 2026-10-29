-- PostgreSQL grants EXECUTE to PUBLIC by default. Revoke it explicitly for all security-definer functions.

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
revoke execute on function public.is_teacher(uuid) from public, anon, authenticated;
revoke execute on function public.owns_class(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.is_active_class_member(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.owns_assignment(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.owns_quiz(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.update_my_display_name(text) from public, anon;
revoke execute on function public.create_class_invite(uuid, timestamptz, integer) from public, anon;
revoke execute on function public.join_class_from_invite(text) from public, anon;
revoke execute on function public.get_quiz_for_student(uuid) from public, anon;

grant execute on function public.update_my_display_name(text) to authenticated;
grant execute on function public.create_class_invite(uuid, timestamptz, integer) to authenticated;
grant execute on function public.join_class_from_invite(text) to authenticated;
grant execute on function public.get_quiz_for_student(uuid) to authenticated;
