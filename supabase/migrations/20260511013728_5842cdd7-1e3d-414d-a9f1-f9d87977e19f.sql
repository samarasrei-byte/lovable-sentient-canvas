
-- ============================================================
-- 1) STORAGE: user-photos bucket (private) — owner-only access
-- ============================================================
DROP POLICY IF EXISTS "Public can view user photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;

-- Authenticated users can read only files they own
CREATE POLICY "Owners can read user photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-photos' AND owner = auth.uid());

-- Authenticated users can upload to user-photos (owner auto-set)
CREATE POLICY "Authenticated users can upload user photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-photos');

-- ============================================================
-- 2) STORAGE: prompt-images bucket — restrict mutations to owner/admin
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can update prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete prompt images" ON storage.objects;

CREATE POLICY "Owners can update prompt images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'prompt-images'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Owners can delete prompt images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'prompt-images'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'))
);

-- ============================================================
-- 3) Credit functions — add caller authorization
-- ============================================================
CREATE OR REPLACE FUNCTION public.consume_credits(p_user_id uuid, p_amount integer, p_description text DEFAULT NULL::text, p_reference_id uuid DEFAULT NULL::uuid, p_reference_type text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_caller uuid := auth.uid();
BEGIN
  -- Authorization: only self, admin, or service role (auth.uid() IS NULL)
  IF v_caller IS NOT NULL
     AND v_caller <> p_user_id
     AND NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT credits_balance INTO v_current_balance
  FROM public.user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  UPDATE public.user_credits
  SET credits_balance = v_new_balance,
      credits_used_this_month = credits_used_this_month + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id, reference_type, balance_after)
  VALUES (p_user_id, -p_amount, 'debit', p_description, p_reference_id, p_reference_type, v_new_balance);

  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount integer, p_type text DEFAULT 'credit'::text, p_description text DEFAULT NULL::text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_new_balance INTEGER;
  v_caller uuid := auth.uid();
BEGIN
  -- Only admins or service role (auth.uid() IS NULL) may grant credits
  IF v_caller IS NOT NULL AND NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.user_credits (user_id, credits_balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id) DO UPDATE
  SET credits_balance = public.user_credits.credits_balance + p_amount,
      updated_at = NOW()
  RETURNING credits_balance INTO v_new_balance;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, v_new_balance);

  RETURN v_new_balance;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_monthly_credits(p_user_id uuid, p_new_credits integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_new_balance INTEGER;
  v_caller uuid := auth.uid();
BEGIN
  IF v_caller IS NOT NULL AND NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.user_credits
  SET credits_balance = p_new_credits,
      credits_used_this_month = 0,
      last_credit_reset = NOW(),
      updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING credits_balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits_balance)
    VALUES (p_user_id, p_new_credits)
    RETURNING credits_balance INTO v_new_balance;
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_new_credits, 'reset', 'Créditos mensais renovados', v_new_balance);

  RETURN v_new_balance;
END;
$function$;

-- ============================================================
-- 4) prompt_purchases — remove unrestricted insert
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can create purchases" ON public.prompt_purchases;

-- Authenticated users may only create purchases tied to their own auth.uid()
-- (column user_id may be nullable; require either match or service role path)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prompt_purchases' AND column_name='user_id'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can create their own purchases"
      ON public.prompt_purchases FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid())
    $p$;
  END IF;
END $$;

-- ============================================================
-- 5) notifications — restrict inserts
-- ============================================================
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Users may insert notifications addressed to themselves (e.g. local reminders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid=p.polrelid
    WHERE c.relname='notifications' AND p.polname='Users can insert own notifications'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can insert own notifications"
      ON public.notifications FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid())
    $p$;
  END IF;
END $$;
