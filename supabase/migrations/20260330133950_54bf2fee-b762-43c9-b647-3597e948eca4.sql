
-- Fix 6 prompts missing CRITICAL FIDELITY INSTRUCTION
-- Add fidelity block to each prompt that's missing it

UPDATE prompts SET prompt_template = prompt_template || E'\n\n--- CRITICAL FIDELITY INSTRUCTION ---\nThe uploaded reference photo is the ONLY source of truth for the person''s identity.\nYou MUST preserve with 100% accuracy: exact eye shape, size, spacing, color and depth; precise nose bridge width, nostril shape, tip angle; exact mouth shape, lip thickness, smile line; jawline contour, chin shape, cheekbone structure; skin tone, texture, pores, moles, freckles, scars; hair color, texture, density, length, style; eyebrow shape, thickness, arch; ear shape and size; forehead proportions.\nThe generated person MUST be INSTANTLY and UNMISTAKABLY recognizable as the EXACT same person from the reference photo.\nDo NOT invent, alter, or idealize ANY facial feature. Treat the reference photo as a fingerprint — unique and non-negotiable.'
WHERE id IN (
  '34223533-b9c5-4bfd-8b2a-68238001df57',
  'c43de0f2-7b3c-47f5-a24b-dbe592be1e30',
  'd34c6a1c-a9cb-4291-bc07-0ac053f7742b',
  '9a0de6fa-624a-491b-aecc-80fecf246e7e',
  '9642ef50-6a04-4780-a12c-faad747b023f',
  '69db1535-58a2-4291-84dc-2b2da6bc78c9'
) AND status = 'active';

-- Also fix the Rafael Motta prompt to be generic (remove hardcoded person name)
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Rafael Motta, oval face, clear light-to-medium skin tone with neutral-warm undertone, dark brown eyes, short dark brown hair neatly styled with subtle natural volume, clean-shaven face, broad friendly smile with aligned teeth', 'the person from the reference photo, preserving their exact facial features, skin tone, eye color, hair style')
WHERE id = 'c43de0f2-7b3c-47f5-a24b-dbe592be1e30';

-- Fix the "homem adulto" prompt to be gender-neutral and reference-based
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'de um homem adulto sentado', 'da pessoa da foto de referência sentada')
WHERE id = '34223533-b9c5-4bfd-8b2a-68238001df57';
