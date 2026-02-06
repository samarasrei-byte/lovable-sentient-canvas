-- Add new fields to prompts table for complete admin control
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS negative_prompt TEXT,
ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'gemini-2.5-flash-image',
ADD COLUMN IF NOT EXISTS min_photos INTEGER DEFAULT 1;

-- Update required_fields to support more field types
-- The required_fields JSONB already exists and supports: photo, name, instagram, email
-- Adding additional_description as a new option will be handled in the UI