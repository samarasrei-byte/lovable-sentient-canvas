INSERT INTO storage.buckets (id, name, public) VALUES ('user-videos', 'user-videos', true);

CREATE POLICY "Public access for user videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-videos');

CREATE POLICY "Users can upload their own videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-videos');