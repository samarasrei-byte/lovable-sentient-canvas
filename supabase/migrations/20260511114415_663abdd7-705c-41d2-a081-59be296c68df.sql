-- Revoke from anon to fix 0028
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Revoke from authenticated to fix 0029 (for functions that don't need it)
-- For those that DO need it, we should move them to a private schema.
-- But let's start by revoking from everyone and see what's left.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;

-- Grant back only to service_role for internal stuff
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- If some functions MUST be called by authenticated users, the linter will complain if they are security definer.
-- We will move those to a private schema in the next step if this doesn't clear enough.
