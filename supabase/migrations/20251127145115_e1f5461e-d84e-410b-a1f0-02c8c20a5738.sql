-- Add likes table for tracking individual likes
CREATE TABLE IF NOT EXISTS public.image_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID NOT NULL REFERENCES public.generated_images(id) ON DELETE CASCADE,
  user_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(image_id, user_fingerprint)
);

-- Enable RLS
ALTER TABLE public.image_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert likes
CREATE POLICY "Anyone can like images"
  ON public.image_likes
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view likes
CREATE POLICY "Anyone can view likes"
  ON public.image_likes
  FOR SELECT
  USING (true);

-- Create index for performance
CREATE INDEX idx_image_likes_image_id ON public.image_likes(image_id);
CREATE INDEX idx_image_likes_fingerprint ON public.image_likes(user_fingerprint);