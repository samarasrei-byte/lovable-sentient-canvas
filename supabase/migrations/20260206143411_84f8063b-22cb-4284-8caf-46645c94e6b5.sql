-- Add RLS policies for storage bucket prompt-images to allow authenticated users to upload

-- First, ensure any existing policies don't conflict
DROP POLICY IF EXISTS "Authenticated users can upload prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete prompt images" ON storage.objects;

-- Allow anyone to view images (bucket is public)
CREATE POLICY "Public can view prompt images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prompt-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload prompt images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'prompt-images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update prompt images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'prompt-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete prompt images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'prompt-images');