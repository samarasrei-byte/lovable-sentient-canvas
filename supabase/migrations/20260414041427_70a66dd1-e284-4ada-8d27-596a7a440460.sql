-- Allow service_role full access to prompt-images bucket
CREATE POLICY "Service role can manage prompt images"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'prompt-images')
WITH CHECK (bucket_id = 'prompt-images');

-- Also allow service_role full access to user-photos bucket  
CREATE POLICY "Service role can manage user photos"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'user-photos')
WITH CHECK (bucket_id = 'user-photos');