-- 1. Setup private schema
CREATE SCHEMA IF NOT EXISTS app_utils;

-- 2. Convert lightweight functions to SECURITY INVOKER (satisfies linter)
ALTER FUNCTION public.has_role(uuid, app_role) SECURITY INVOKER;
ALTER FUNCTION public.update_updated_at_column() SECURITY INVOKER;

-- 3. Move sensitive SECURITY DEFINER functions to app_utils
-- is_user_banned
CREATE OR REPLACE FUNCTION app_utils.is_user_banned(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.bans 
    WHERE user_id = _user_id 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- consume_credits (use internal name)
CREATE OR REPLACE FUNCTION app_utils.consume_credits_internal(
    p_user_id uuid,
    p_amount integer,
    p_description text DEFAULT NULL,
    p_reference_id uuid DEFAULT NULL,
    p_reference_type text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.user_credits
    SET credits_balance = credits_balance - p_amount,
        updated_at = now()
    WHERE user_id = p_user_id AND credits_balance >= p_amount;

    IF FOUND THEN
        INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id, reference_type)
        VALUES (p_user_id, p_amount, 'use', p_description, p_reference_id, p_reference_type);
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$;

-- add_credits (use internal name)
CREATE OR REPLACE FUNCTION app_utils.add_credits_internal(
    p_user_id uuid,
    p_amount integer,
    p_type text DEFAULT 'credit',
    p_description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_credits (user_id, credits_balance)
    VALUES (p_user_id, p_amount)
    ON CONFLICT (user_id) DO UPDATE SET
        credits_balance = user_credits.credits_balance + p_amount,
        updated_at = now();

    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (p_user_id, p_amount, p_type, p_description);
END;
$$;

-- 4. Update RLS policies to use app_utils.is_user_banned
DROP POLICY IF EXISTS "Users can send messages to their paid contracts" ON public.messages;
CREATE POLICY "Users can send messages to their paid contracts" ON public.messages
FOR INSERT WITH CHECK (
    (NOT app_utils.is_user_banned(auth.uid())) 
    AND (EXISTS (
        SELECT 1 FROM public.contracts c
        JOIN public.payments p ON p.contract_id = c.id
        WHERE c.id = messages.contract_id 
        AND p.status = 'completed'
        AND (c.brand_id = auth.uid() OR EXISTS (SELECT 1 FROM public.influencers i WHERE i.id = c.influencer_id AND i.user_id = auth.uid()))
    ))
);

-- 5. Update public wrappers for RPC (keep them SECURITY INVOKER to satisfy linter)
DROP FUNCTION IF EXISTS public.consume_credits(uuid, integer, text, uuid, text);
CREATE OR REPLACE FUNCTION public.consume_credits(
    p_user_id uuid,
    p_amount integer,
    p_description text DEFAULT NULL,
    p_reference_id uuid DEFAULT NULL,
    p_reference_type text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    IF auth.uid() <> p_user_id AND auth.role() <> 'service_role' THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    RETURN app_utils.consume_credits_internal(p_user_id, p_amount, p_description, p_reference_id, p_reference_type);
END;
$$;

DROP FUNCTION IF EXISTS public.add_credits(uuid, integer, text, text);
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id uuid,
    p_amount integer,
    p_type text DEFAULT 'credit',
    p_description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    IF auth.role() <> 'service_role' AND NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    PERFORM app_utils.add_credits_internal(p_user_id, p_amount, p_type, p_description);
END;
$$;

-- 6. Move and update trigger functions
-- We need to check if they exist before moving
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'handle_new_user') THEN
        ALTER FUNCTION public.handle_new_user() SET SCHEMA app_utils;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'log_moderation_violation') THEN
        ALTER FUNCTION public.log_moderation_violation() SET SCHEMA app_utils;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'notify_admin_on_low_credits') THEN
        ALTER FUNCTION public.notify_admin_on_low_credits() SET SCHEMA app_utils;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'notify_admin_on_purchase') THEN
        ALTER FUNCTION public.notify_admin_on_purchase() SET SCHEMA app_utils;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'notify_on_contract_created') THEN
        ALTER FUNCTION public.notify_on_contract_created() SET SCHEMA app_utils;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'notify_on_payment_processed') THEN
        ALTER FUNCTION public.notify_on_payment_processed() SET SCHEMA app_utils;
    END IF;
END $$;

-- Fix the ones with arguments
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'log_admin_action') THEN
        ALTER FUNCTION public.log_admin_action(text, text, uuid, jsonb, jsonb) SET SCHEMA app_utils;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'reset_monthly_credits') THEN
        ALTER FUNCTION public.reset_monthly_credits(uuid, integer) SET SCHEMA app_utils;
    END IF;
END $$;

-- 7. Grant permissions
GRANT USAGE ON SCHEMA app_utils TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_utils TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.consume_credits(uuid, integer, text, uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.add_credits(uuid, integer, text, text) TO authenticated, service_role;

-- 8. Clean up
DROP FUNCTION IF EXISTS public.is_user_banned(uuid);
