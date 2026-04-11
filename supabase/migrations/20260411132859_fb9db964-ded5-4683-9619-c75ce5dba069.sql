-- Move Ursinho Chocolate to Mêsversário category
UPDATE public.prompts 
SET category = 'Mêsversário', 
    ai_model = 'google/gemini-3.1-flash-image-preview',
    updated_at = now()
WHERE name = 'Ursinho Chocolate' AND category = 'Hypando';

-- Standardize ai_model for all Mêsversário prompts
UPDATE public.prompts 
SET ai_model = 'google/gemini-3.1-flash-image-preview',
    updated_at = now()
WHERE category = 'Mêsversário' AND ai_model != 'google/gemini-3.1-flash-image-preview';