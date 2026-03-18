-- Secure signup provisioning in backend instead of client-side inserts
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_role_text text;
  v_role public.app_role;
  v_stage_name text;
  v_category text;
  v_price_per_post numeric;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    updated_at = now();

  v_role_text := lower(COALESCE(NEW.raw_user_meta_data->>'user_type', 'brand'));

  v_role := CASE
    WHEN NEW.email IN ('admin@arcana.com', 'qa-tester@arcana.internal') THEN 'admin'::public.app_role
    WHEN v_role_text = 'influencer' THEN 'influencer'::public.app_role
    WHEN v_role_text IN ('brand', 'whitelabel', 'agency') THEN 'brand'::public.app_role
    ELSE 'brand'::public.app_role
  END;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  IF v_role = 'influencer' THEN
    v_stage_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'stage_name', ''), NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'Novo Influenciador');
    v_category := COALESCE(NULLIF(NEW.raw_user_meta_data->>'category', ''), 'Lifestyle');
    v_price_per_post := CASE
      WHEN NULLIF(NEW.raw_user_meta_data->>'price_per_post', '') IS NOT NULL THEN (NEW.raw_user_meta_data->>'price_per_post')::numeric
      ELSE 0
    END;

    INSERT INTO public.influencers (user_id, stage_name, category, price_per_post, followers_count, engagement_rate)
    SELECT NEW.id, v_stage_name, v_category, v_price_per_post, 0, 0
    WHERE NOT EXISTS (
      SELECT 1 FROM public.influencers WHERE user_id = NEW.id
    );
  END IF;

  RETURN NEW;
END;
$function$;