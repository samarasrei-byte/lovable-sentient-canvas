-- Make user-photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'user-photos';

-- Ensure RLS policies exist for user-photos
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own photos
CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all photos
CREATE POLICY "Admins can view all user photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-photos' AND public.has_role(auth.uid(), 'admin'));

-- Allow service role full access (for edge functions)
CREATE POLICY "Service role full access to user photos"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'user-photos')
WITH CHECK (bucket_id = 'user-photos');