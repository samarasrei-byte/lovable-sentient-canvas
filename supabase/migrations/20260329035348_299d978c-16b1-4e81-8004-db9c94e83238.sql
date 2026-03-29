
UPDATE prompts 
SET prompt_template = prompt_template || '

CRITICAL FIDELITY INSTRUCTION: Use the uploaded reference photo as the ABSOLUTE and ONLY source of truth for the subject''s face, identity, and physical features. You MUST preserve 100% facial fidelity from the reference image — including exact facial structure, bone structure, eye shape, eye color, nose shape, nose size, lip shape, lip thickness, jawline, chin shape, forehead proportions, eyebrow shape and thickness, skin tone, skin texture, facial hair (if any), hair color, hair texture, hair style, ear shape, cheekbone structure, facial symmetry, and all unique identifying marks such as moles, freckles, scars, dimples, and wrinkles. The generated image MUST look like the EXACT SAME PERSON from the reference photo — not a similar person, not an approximation, but an identical match. Do NOT alter, idealize, smooth, age, de-age, or stylize any facial feature. Do NOT replace the face with a generic model or stock face. Every anatomical detail of the body visible in the reference must also be preserved: body proportions, build, posture, hand shape, and skin tone consistency across all visible areas. Treat the reference photo as a sacred, unalterable identity document.'
WHERE status = 'active' 
AND prompt_template NOT LIKE '%CRITICAL FIDELITY%'
AND id IN (
  'cc078e96-572c-45a4-bd72-ae202dd17f9a',
  '78a95cd8-5b61-44c9-bcfe-290098cd95c5',
  '661877bb-510d-47b1-b76d-70e13f811d57',
  'b9e02390-46da-4242-b9de-98aef4816949',
  'e8745ed0-0c5a-44e1-9ca7-e209a569b681',
  '2fb2ce7d-8bd9-4fab-8da1-ea0f63a40b7f',
  'd75e8987-ee8d-4a8d-a8e4-85c41bf2fe7f',
  'a63dab4c-30d6-4104-a536-711e1e1e74f6',
  'c31cf351-09df-4174-ad4c-b97dbc4a8d50',
  'b0195584-84fd-4ba2-82ae-1e2e7d0e99bf'
);
