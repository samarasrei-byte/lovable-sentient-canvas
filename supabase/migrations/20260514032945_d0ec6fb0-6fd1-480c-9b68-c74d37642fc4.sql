DROP POLICY "Public access for user videos" ON storage.objects;

CREATE POLICY "Public access for user videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-videos' AND (storage.foldername(name))[1] IS NOT NULL);