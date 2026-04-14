
-- 1. FIX user_credits: Remove dangerous ALL USING(true) for public
DROP POLICY IF EXISTS "System can manage credits" ON public.user_credits;

-- Users can only view their own credits
CREATE POLICY "Users can view own credits"
ON public.user_credits
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service role manages credits (for functions)
CREATE POLICY "Service role manages credits"
ON public.user_credits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. FIX profiles: Remove public SELECT that exposes all emails
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. FIX photo_generations: Remove policy that exposes PII
DROP POLICY IF EXISTS "Users can view their own generations" ON public.photo_generations;

CREATE POLICY "Users can view own generations"
ON public.photo_generations
FOR SELECT
TO authenticated
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 4. FIX prompt_purchases: Restrict INSERT to authenticated only
DROP POLICY IF EXISTS "Anyone can create purchases" ON public.prompt_purchases;

CREATE POLICY "Authenticated users can create purchases"
ON public.prompt_purchases
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also allow service_role for edge functions creating purchases
CREATE POLICY "Service role can create purchases"
ON public.prompt_purchases
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. FIX prompt_test_results: Restrict INSERT to admin/service_role
DROP POLICY IF EXISTS "Anyone can insert test results" ON public.prompt_test_results;

CREATE POLICY "Service role can insert test results"
ON public.prompt_test_results
FOR INSERT
TO service_role
WITH CHECK (true);
