
-- Function to notify admins when a purchase is made
CREATE OR REPLACE FUNCTION public.notify_admin_on_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_record RECORD;
  v_prompt_name TEXT;
  v_amount_display TEXT;
BEGIN
  -- Get prompt name
  SELECT name INTO v_prompt_name FROM public.prompts WHERE id = NEW.prompt_id;
  v_amount_display := 'R$ ' || (NEW.amount_cents / 100.0)::TEXT;

  -- Notify all admins
  FOR admin_record IN
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
    VALUES (
      admin_record.user_id,
      '💰 Nova Venda!',
      COALESCE(NEW.user_name, 'Cliente') || ' comprou "' || COALESCE(v_prompt_name, 'Prompt') || '" por ' || v_amount_display,
      'payment',
      '/admin/prompts',
      jsonb_build_object(
        'purchase_id', NEW.id,
        'prompt_id', NEW.prompt_id,
        'amount_cents', NEW.amount_cents,
        'user_name', NEW.user_name,
        'payment_method', NEW.payment_method
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Trigger on prompt_purchases insert
CREATE TRIGGER on_prompt_purchase_notify_admin
AFTER INSERT ON public.prompt_purchases
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_purchase();

-- Function to notify admins when credits are low
CREATE OR REPLACE FUNCTION public.notify_admin_on_low_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_record RECORD;
  v_user_name TEXT;
  v_threshold INTEGER := 3;
BEGIN
  -- Only trigger when balance drops below threshold
  IF NEW.credits_balance < v_threshold AND (OLD.credits_balance IS NULL OR OLD.credits_balance >= v_threshold) THEN
    -- Get user name
    SELECT full_name INTO v_user_name FROM public.profiles WHERE id = NEW.user_id;

    FOR admin_record IN
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    LOOP
      INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
      VALUES (
        admin_record.user_id,
        '⚠️ Créditos Baixos',
        COALESCE(v_user_name, 'Usuário') || ' está com apenas ' || NEW.credits_balance || ' créditos restantes',
        'system',
        '/admin/users',
        jsonb_build_object(
          'user_id', NEW.user_id,
          'credits_balance', NEW.credits_balance,
          'user_name', v_user_name
        )
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on user_credits update
CREATE TRIGGER on_low_credits_notify_admin
AFTER UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_low_credits();
