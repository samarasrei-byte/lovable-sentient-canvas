
-- Corrige consumo de créditos: registrava transação sem balance_after (NOT NULL),
-- o que fazia TODA operação de crédito falhar com erro de constraint.
CREATE OR REPLACE FUNCTION app_utils.consume_credits_internal(p_user_id uuid, p_amount integer, p_description text DEFAULT NULL::text, p_reference_id uuid DEFAULT NULL::uuid, p_reference_type text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_new_balance integer;
BEGIN
    UPDATE public.user_credits
    SET credits_balance = credits_balance - p_amount,
        credits_used_this_month = credits_used_this_month + p_amount,
        updated_at = now()
    WHERE user_id = p_user_id AND credits_balance >= p_amount
    RETURNING credits_balance INTO v_new_balance;

    IF FOUND THEN
        INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id, reference_type, balance_after)
        VALUES (p_user_id, -p_amount, 'use', p_description, p_reference_id, p_reference_type, v_new_balance);
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$function$;

-- Corrige adição de créditos: mesmo problema de balance_after ausente.
CREATE OR REPLACE FUNCTION app_utils.add_credits_internal(p_user_id uuid, p_amount integer, p_type text DEFAULT 'credit'::text, p_description text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_new_balance integer;
BEGIN
    INSERT INTO public.user_credits (user_id, credits_balance)
    VALUES (p_user_id, p_amount)
    ON CONFLICT (user_id) DO UPDATE SET
        credits_balance = user_credits.credits_balance + p_amount,
        updated_at = now()
    RETURNING credits_balance INTO v_new_balance;

    INSERT INTO public.credit_transactions (user_id, amount, type, description, balance_after)
    VALUES (p_user_id, p_amount, p_type, p_description, v_new_balance);
END;
$function$;
