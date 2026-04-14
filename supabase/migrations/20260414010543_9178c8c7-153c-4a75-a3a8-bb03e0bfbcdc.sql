
-- Fix prompts: only admins should INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Authenticated users can delete prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can insert prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can update prompts" ON public.prompts;

CREATE POLICY "Only admins can insert prompts"
ON public.prompts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update prompts"
ON public.prompts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete prompts"
ON public.prompts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix prompt_purchases: remove public SELECT, add scoped policies
DROP POLICY IF EXISTS "Anyone can view purchases" ON public.prompt_purchases;

CREATE POLICY "Users can view their own purchases by email"
ON public.prompt_purchases FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR (user_email IS NOT NULL AND user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);
