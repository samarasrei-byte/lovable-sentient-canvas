UPDATE prompts 
SET prompt_template = prompt_template || '

CRITICAL FIDELITY INSTRUCTION: Use the uploaded reference photo as the ABSOLUTE and ONLY source of truth for the subject''s face, identity, and physical features. You MUST preserve 100% facial fidelity from the reference image — including exact facial structure, bone structure, eye shape, eye color, nose shape, nose size, lip shape, lip thickness, jawline, chin shape, forehead proportions, eyebrow shape and thickness, skin tone, skin texture, facial hair (if any), hair color, hair texture, hair style, ear shape, cheekbone structure, facial symmetry, and all unique identifying marks such as moles, freckles, scars, dimples, and wrinkles. The generated image MUST look like the EXACT SAME PERSON from the reference photo — not a similar person, not an approximation, but an identical match. Do NOT alter, idealize, smooth, age, de-age, or stylize any facial feature. Do NOT replace the face with a generic model or stock face. Every anatomical detail of the body visible in the reference must also be preserved: body proportions, build, posture, hand shape, and skin tone consistency across all visible areas. Treat the reference photo as a sacred, unalterable identity document.'
WHERE status = 'active'
  AND prompt_template NOT LIKE '%CRITICAL FIDELITY%'
  AND prompt_template NOT LIKE '%MASTER REFERENCE LOCK%'
  AND prompt_template NOT LIKE '%100!% facial fidelity%' ESCAPE '!'
  AND prompt_template NOT LIKE '%100!% fidelidade facial%' ESCAPE '!';