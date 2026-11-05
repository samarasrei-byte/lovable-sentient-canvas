
-- Configuração pública da página inicial (leitura segura para visitantes)
CREATE OR REPLACE FUNCTION public.get_homepage_config()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT setting_value FROM public.admin_settings WHERE setting_key = 'homepage_config'),
    '{"highlight":"batch","show_secondary_features":true}'::jsonb
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_homepage_config() TO anon, authenticated;

-- Escrita restrita a administradores
CREATE OR REPLACE FUNCTION public.set_homepage_config(p_value jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO public.admin_settings (setting_key, setting_value, updated_by)
  VALUES ('homepage_config', p_value, auth.uid())
  ON CONFLICT (setting_key)
  DO UPDATE SET setting_value = EXCLUDED.setting_value,
                updated_by = EXCLUDED.updated_by,
                updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_homepage_config(jsonb) TO authenticated;
