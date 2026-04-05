
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SANITIZAÇÃO MASSIVA: Remover traços físicos fixos de TODOS os prompts
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 1. ENGLISH: Replace gendered descriptions with neutral ones
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a young man', 'the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%a young man%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A young man', 'The person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%A young man%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'an adult male', 'the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%an adult male%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'An adult male', 'The person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%An adult male%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a male athlete', 'the person from the reference photo as an athlete') WHERE status = 'active' AND prompt_template ILIKE '%a male athlete%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A stylish young woman', 'The person from the reference photo, stylish,') WHERE status = 'active' AND prompt_template ILIKE '%A stylish young woman%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a stylish young woman', 'the person from the reference photo, stylish,') WHERE status = 'active' AND prompt_template ILIKE '%a stylish young woman%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a woman', 'the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%a woman%' AND prompt_template NOT ILIKE '%the person from the reference photo%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A woman', 'The person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%A woman%' AND prompt_template NOT ILIKE '%The person from the reference photo%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'of a man', 'of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%of a man%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a female figure', 'the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%a female figure%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A female figure', 'The person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%A female figure%';

-- 2. PORTUGUESE: Replace gendered descriptions
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A mulher tem', 'A pessoa da foto de referência tem') WHERE status = 'active' AND prompt_template ILIKE '%A mulher tem%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a mulher tem', 'a pessoa da foto de referência tem') WHERE status = 'active' AND prompt_template ILIKE '%a mulher tem%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'A mulher está', 'A pessoa da foto de referência está') WHERE status = 'active' AND prompt_template ILIKE '%A mulher está%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'O homem está', 'A pessoa da foto de referência está') WHERE status = 'active' AND prompt_template ILIKE '%O homem está%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Retrato profissional feminino', 'Retrato profissional da pessoa da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%Retrato profissional feminino%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'retrato feminino', 'retrato da pessoa da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%retrato feminino%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Mulher elegante', 'Pessoa elegante da foto de referência') WHERE status = 'active' AND prompt_template ILIKE '%Mulher elegante%';

-- 3. REMOVE hardcoded hair/beard descriptions (EN)
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*dark hair with natural volume', ', hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark hair with natural volume%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*short well-groomed beard', ', facial hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%short well-groomed beard%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*with a beard', ', with facial hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%with a beard%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*light skin with natural texture', ', skin tone and texture exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%light skin with natural texture%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*dark skin', ', skin tone exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark skin%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*fair skin', ', skin tone exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%fair skin%';

-- 4. REMOVE hardcoded hair descriptions (PT)
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'cabelos loiros na altura dos ombros', 'cabelo conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%cabelos loiros%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'cabelo loiro', 'cabelo conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%cabelo loiro%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'cabelo castanho', 'cabelo conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%cabelo castanho%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'cabelo preto', 'cabelo conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%cabelo preto%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'cabelo longo', 'cabelo conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%cabelo longo%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'cabelo curto', 'cabelo conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%cabelo curto%';

-- 5. REMOVE hardcoded eye descriptions
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'blue eyes', 'eyes exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%blue eyes%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'green eyes', 'eyes exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%green eyes%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'brown eyes', 'eyes exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%brown eyes%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'olhos azuis', 'olhos conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%olhos azuis%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'olhos verdes', 'olhos conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%olhos verdes%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'olhos castanhos', 'olhos conforme a foto de referência', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%olhos castanhos%';

-- 6. FIX "two young men" / "two subjects" patterns  
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'two young men', 'the two people from the reference photos') WHERE status = 'active' AND prompt_template ILIKE '%two young men%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'two subjects (female and male)', 'two subjects (matching the reference photos exactly)') WHERE status = 'active' AND prompt_template ILIKE '%two subjects (female and male)%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'the male subj', 'the subj') WHERE status = 'active' AND prompt_template ILIKE '%the male subj%';

-- 7. FIX specific problematic prompts by ID

-- "Futebol" prompts with "inspired by Rafael" / fixed male descriptions
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'inspired by Rafael,?\s*', '', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%inspired by Rafael%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'inspired by Rafa\b', '', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%inspired by Rafa%';

-- "Selfie no Avião" with hardcoded descriptions
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'foreground subject: young man,?\s*light skin with natural texture,?\s*', 'foreground subject: person from reference photo 1, ', 'gi') WHERE id = '3c23951d-d48e-4a61-b67a-7196a9d92cb0';

-- "Image of a woman" patterns
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'image of a woman', 'image of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%image of a woman%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Image of a woman', 'Image of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%Image of a woman%';

-- "portrait of a woman" / "portrait of a man"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'portrait of a woman', 'portrait of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%portrait of a woman%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'portrait of a man', 'portrait of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%portrait of a man%';

-- "photograph of a woman"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'photograph of a woman', 'photograph of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%photograph of a woman%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'photograph of a man', 'photograph of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%photograph of a man%';

-- "She is" / "He is" patterns
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'She is wearing', 'The person is wearing') WHERE status = 'active' AND prompt_template ILIKE '%She is wearing%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'He is wearing', 'The person is wearing') WHERE status = 'active' AND prompt_template ILIKE '%He is wearing%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'She is captured', 'The person is captured') WHERE status = 'active' AND prompt_template ILIKE '%She is captured%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'He is captured', 'The person is captured') WHERE status = 'active' AND prompt_template ILIKE '%He is captured%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'she wears', 'the person wears') WHERE status = 'active' AND prompt_template ILIKE '%she wears%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'She wears', 'The person wears') WHERE status = 'active' AND prompt_template ILIKE '%She wears%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'he wears', 'the person wears') WHERE status = 'active' AND prompt_template ILIKE '%he wears%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'his face', 'their face') WHERE status = 'active' AND prompt_template ILIKE '%his face%' AND prompt_template NOT ILIKE '%this face%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'her face', 'their face') WHERE status = 'active' AND prompt_template ILIKE '%her face%' AND prompt_template NOT ILIKE '%their face%';

-- "Ela veste" / "Ele veste"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Ela veste', 'A pessoa veste') WHERE status = 'active' AND prompt_template ILIKE '%Ela veste%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Ela Veste', 'A pessoa veste') WHERE status = 'active' AND prompt_template ILIKE '%Ela Veste%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Ele veste', 'A pessoa veste') WHERE status = 'active' AND prompt_template ILIKE '%Ele veste%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Ela usa', 'A pessoa usa') WHERE status = 'active' AND prompt_template ILIKE '%Ela usa%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Ele usa', 'A pessoa usa') WHERE status = 'active' AND prompt_template ILIKE '%Ele usa%';

-- 8. Rename remaining duplicate "Portrait Style" prompts
UPDATE prompts SET name = 'Retrato Artístico Side-Profile' WHERE id = 'f64f8e33-c4c3-49d4-8306-4668aba712ec' AND name = 'Portrait Style';
UPDATE prompts SET name = 'Capitão Pirata Cinematográfico' WHERE id = '98d3b1e7-b141-4156-86d9-028b2680b4fe' AND name = 'Portrait Style';
UPDATE prompts SET name = 'Retrato Introspectivo Close-Up' WHERE id = '824125f7-5589-44c3-bd6c-5af4ee453a87' AND name = 'Portrait Style';
UPDATE prompts SET name = 'Copa do Mundo Action Shot' WHERE id = '53cf8b57-9cdf-4e20-b544-6cd996c95b5c' AND name = 'Portrait Style';

-- 9. Rename duplicate "Foto de aniversário" prompts
UPDATE prompts SET name = 'Aniversário Balões Dourados Studio' WHERE id = '97bf85b3-f989-418a-ac4c-c77e4bf842e2' AND name = 'Foto de aniversário';
UPDATE prompts SET name = 'Aniversário Festa Iluminada' WHERE id = '998dae04-8510-43f3-8816-bbc8fef3d0af' AND name = 'Foto de aniversário';
UPDATE prompts SET name = 'Aniversário Sorriso Studio' WHERE id = '8d1bb2ec-d564-4f59-ad1f-361ae1f9655a' AND name = 'Foto de aniversário';

-- 10. Rename duplicate "Futebol" prompts
UPDATE prompts SET name = 'Futebol Poster Cinematográfico' WHERE id = 'bec3964f-006f-4557-b5f0-a70629aa5cb9' AND name = 'Futebol';
UPDATE prompts SET name = 'Futebol Double Exposure Editorial' WHERE id = '2917c9af-672a-4e51-b6cd-a91f676bbcf3' AND name = 'Futebol';
