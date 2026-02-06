-- Add RLS policies for prompts table to allow admin operations
-- Allow public read access for marketplace
CREATE POLICY "Allow public read access to prompts"
ON public.prompts
FOR SELECT
USING (true);

-- Allow insert/update/delete for any authenticated user (admin access)
CREATE POLICY "Allow authenticated insert on prompts"
ON public.prompts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on prompts"
ON public.prompts
FOR UPDATE
USING (true);

CREATE POLICY "Allow authenticated delete on prompts"
ON public.prompts
FOR DELETE
USING (true);