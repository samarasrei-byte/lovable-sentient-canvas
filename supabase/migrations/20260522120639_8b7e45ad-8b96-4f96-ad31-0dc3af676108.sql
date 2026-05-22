-- Make bucket public
UPDATE storage.buckets SET public = true WHERE id = 'user-photos';

-- Allow public access to read objects in user-photos
CREATE POLICY "Public Access to user-photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-photos');

-- Allow anonymous and authenticated users to upload to user-photos
CREATE POLICY "Anyone can upload user-photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'user-photos');

-- Allow users to delete their own uploads if they are authenticated
-- (Optional, but good practice if we want to keep things clean)
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-photos' AND (auth.uid()::text = (storage.foldername(name))[1]));
