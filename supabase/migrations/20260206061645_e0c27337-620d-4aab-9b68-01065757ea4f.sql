
-- Drop existing restrictive policies on prompts and create simple authenticated ones
DROP POLICY IF EXISTS "Admins can manage prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow authenticated insert on prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow authenticated update on prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow authenticated delete on prompts" ON public.prompts;

-- Create simple authenticated policies for admin operations
CREATE POLICY "Authenticated users can insert prompts"
ON public.prompts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update prompts"
ON public.prompts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete prompts"
ON public.prompts FOR DELETE
TO authenticated
USING (true);
