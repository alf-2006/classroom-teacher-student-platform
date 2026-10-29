-- No current UI calls this RPC; keep profile mutations out of the public API until a validated form exists.
revoke execute on function public.update_my_display_name(text) from public, anon, authenticated;
