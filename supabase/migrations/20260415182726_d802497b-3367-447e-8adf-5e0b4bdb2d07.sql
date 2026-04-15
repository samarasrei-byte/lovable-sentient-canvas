-- Fix photo_generations INSERT policy to prevent anonymous arbitrary user_id
DROP POLICY IF EXISTS "Anyone can create photo generations" ON public.photo_generations;

CREATE POLICY "Authenticated users can create photo generations"
ON public.photo_generations
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Anon can create photo generations without user_id"
ON public.photo_generations
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);