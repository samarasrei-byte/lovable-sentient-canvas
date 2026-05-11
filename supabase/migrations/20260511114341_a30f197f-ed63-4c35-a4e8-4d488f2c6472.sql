-- 1. Security Definer View fix
ALTER VIEW public.admin_credit_stats SET (security_invoker = on);

-- 2. Function Search Path Mutable fix
ALTER FUNCTION public.log_moderation_violation() SET search_path = public;

-- 3. Extension in Public fix
CREATE SCHEMA IF NOT EXISTS extensions;
-- Move pg_net by dropping and recreating in the correct schema
-- We do this because pg_net doesn't support ALTER EXTENSION ... SET SCHEMA
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net SCHEMA extensions;

-- 4. RLS Policy Always True / Permissive fixes
DROP POLICY IF EXISTS "Authenticated users can like images" ON public.image_likes;
CREATE POLICY "Authenticated users can like images" 
ON public.image_likes 
FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public can view prompt images" ON storage.objects;
CREATE POLICY "Public can view prompt images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'prompt-images' AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp', 'avif')));

DROP POLICY IF EXISTS "Authenticated users can upload prompt images" ON storage.objects;
CREATE POLICY "Authenticated users can upload prompt images"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'prompt-images' 
    AND auth.role() = 'authenticated'
);

-- 5. Revoke Public Execution on Security Definer Functions
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM public;

-- Grant back to necessary roles
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_banned(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credits(uuid, integer, text, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits(uuid, integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_moderation_violation() TO authenticated;

-- Specifically allow anon users for certain public functions if they exist (none identified as essential for anon yet)
-- GRANT EXECUTE ON FUNCTION public.some_public_fn() TO anon;

-- 6. Fix Service Role policies that use (true) to be more explicit
ALTER POLICY "Service role manages customers" ON public.stripe_customers USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
ALTER POLICY "Service role manages checkouts" ON public.checkout_sessions USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
ALTER POLICY "Service role inserts transactions" ON public.credit_transactions WITH CHECK (auth.role() = 'service_role');
ALTER POLICY "Service role inserts notifications" ON public.notifications WITH CHECK (auth.role() = 'service_role');
ALTER POLICY "Service role manages credits" ON public.user_credits USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
ALTER POLICY "Service role can create purchases" ON public.prompt_purchases WITH CHECK (auth.role() = 'service_role');
ALTER POLICY "Service role can insert test results" ON public.prompt_test_results WITH CHECK (auth.role() = 'service_role');
