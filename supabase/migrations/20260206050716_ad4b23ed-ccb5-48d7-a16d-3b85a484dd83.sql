-- Create storage bucket for prompt example images
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to prompt images
CREATE POLICY "Public can view prompt images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prompt-images');

-- Allow authenticated users to upload prompt images
CREATE POLICY "Authenticated users can upload prompt images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prompt-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update prompt images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'prompt-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete prompt images
CREATE POLICY "Authenticated users can delete prompt images"
ON storage.objects FOR DELETE
USING (bucket_id = 'prompt-images' AND auth.role() = 'authenticated');