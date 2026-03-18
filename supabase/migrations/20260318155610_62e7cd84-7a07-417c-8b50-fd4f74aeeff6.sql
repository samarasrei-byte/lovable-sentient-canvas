-- Add reference image instruction to ALL prompts that don't already mention it
UPDATE public.prompts 
SET prompt_template = prompt_template || E'\n\nIMPORTANT: Use the uploaded reference photo as the absolute primary base for the subject''s face, identity, and physical features. Preserve 100% facial fidelity from the reference image. The generated image must look like the exact same person from the reference photo.'
WHERE status = 'active' 
AND prompt_template NOT ILIKE '%reference photo%'
AND prompt_template NOT ILIKE '%reference image%'
AND prompt_template NOT ILIKE '%uploaded photo%'
AND prompt_template NOT ILIKE '%uploaded image%'
AND prompt_template NOT ILIKE '%uploaded picture%'
AND prompt_template NOT ILIKE '%attached photo%';