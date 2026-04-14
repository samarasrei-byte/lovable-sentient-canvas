
-- 1. Fix stripe_customers: remove ALL USING(true) 
DROP POLICY IF EXISTS "System can manage customers" ON public.stripe_customers;

CREATE POLICY "Service role manages customers"
ON public.stripe_customers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. Fix checkout_sessions: remove ALL USING(true)
DROP POLICY IF EXISTS "System can manage checkouts" ON public.checkout_sessions;

CREATE POLICY "Service role manages checkouts"
ON public.checkout_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Fix credit_transactions: restrict INSERT to authenticated
DROP POLICY IF EXISTS "System can insert transactions" ON public.credit_transactions;

CREATE POLICY "Service role inserts transactions"
ON public.credit_transactions
FOR INSERT
TO service_role
WITH CHECK (true);

-- 4. Fix notifications: restrict INSERT to service_role
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "Service role inserts notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. Fix image_likes: restrict INSERT to authenticated only
DROP POLICY IF EXISTS "Anyone can like images" ON public.image_likes;

CREATE POLICY "Authenticated users can like images"
ON public.image_likes
FOR INSERT
TO authenticated
WITH CHECK (true);
