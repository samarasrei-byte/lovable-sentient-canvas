
-- Round 2: Fix remaining hardcoded traits

-- "A YOUNG MAN" (uppercase)
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A YOUNG MAN', 'THE PERSON FROM THE REFERENCE PHOTO') WHERE status = 'active' AND prompt_template LIKE '%A YOUNG MAN%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'YOUNG MAN', 'PERSON FROM THE REFERENCE PHOTO') WHERE status = 'active' AND prompt_template LIKE '%YOUNG MAN%';

-- "professional woman" / "a professional woman"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a professional woman', 'the person from the reference photo, professional,') WHERE status = 'active' AND prompt_template ILIKE '%a professional woman%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A professional woman', 'The person from the reference photo, professional,') WHERE status = 'active' AND prompt_template ILIKE '%A professional woman%';

-- "male figure" / "female figure"  
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'uploaded male figure', 'uploaded person') WHERE status = 'active' AND prompt_template ILIKE '%uploaded male figure%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'uploaded female figure', 'uploaded person') WHERE status = 'active' AND prompt_template ILIKE '%uploaded female figure%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'male figure', 'person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%male figure%';

-- "mesmo homem" / "mesma mulher"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'o mesmo homem', 'a mesma pessoa da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%o mesmo homem%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'O mesmo homem', 'A mesma pessoa da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%O mesmo homem%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a mesma mulher', 'a mesma pessoa da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%a mesma mulher%';

-- "the man" standalone
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Recreate the man exactly', 'Recreate the person exactly') WHERE status = 'active' AND prompt_template ILIKE '%Recreate the man exactly%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'the man exactly', 'the person exactly') WHERE status = 'active' AND prompt_template ILIKE '%the man exactly%';

-- Hardcoded "dark hair" / "short black natural hair"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*with dark hair\b', ', with hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%with dark hair%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'dark hair styled', 'hair styled', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark hair styled%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'short black natural hair', 'hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%short black natural hair%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'medium-brown skin tone', 'skin tone exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%medium-brown skin tone%';

-- "athlete with dark hair" pattern
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'athlete with dark hair\b', 'athlete with hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%athlete with dark hair%';

-- "Você está ao lado de um homem"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'ao lado de um homem inspirado em Steve Jobs, que te entrega', 'ao lado de uma pessoa inspirada em Steve Jobs, que te entrega') WHERE status = 'active' AND prompt_template ILIKE '%ao lado de um homem%';

-- "mostrando o mesmo homem"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'mostrando o mesmo homem', 'mostrando a mesma pessoa da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%mostrando o mesmo homem%';

-- "both subjects" with gender specification
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'both subjects facing each other', 'both subjects (matching reference photos) facing each other', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%both subjects facing%';

-- Remaining "her" / "his" possessives in physical descriptions
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'her head tilted', 'their head tilted') WHERE status = 'active' AND prompt_template ILIKE '%her head tilted%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'her arms', 'their arms') WHERE status = 'active' AND prompt_template ILIKE '%her arms%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'her eyes', 'their eyes') WHERE status = 'active' AND prompt_template ILIKE '%her eyes%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'her chin', 'their chin') WHERE status = 'active' AND prompt_template ILIKE '%her chin%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'his legs', 'their legs') WHERE status = 'active' AND prompt_template ILIKE '%his legs%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'his arms', 'their arms') WHERE status = 'active' AND prompt_template ILIKE '%his arms%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'His legs', 'Their legs') WHERE status = 'active' AND prompt_template ILIKE '%His legs%';

-- Fix remaining "Portrait Style" duplicates
UPDATE prompts SET name = 'Retrato High-Detail Studio' WHERE id = 'c6a535f4-ada2-47c8-890a-f6b88cf0e66a' AND name = 'Portrait Style';
