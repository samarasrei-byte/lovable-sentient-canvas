
-- 1. Rename duplicate "Portrait Style" prompts with unique names
UPDATE prompts SET name = 'Executivo Black Suit Editorial' WHERE id = '1771ec39-907a-4ac0-9d5b-5f6b0639c635';
UPDATE prompts SET name = 'Executivo Clássico Studio' WHERE id = 'c3efee53-b118-4c54-8038-0b5b07ee489e';
UPDATE prompts SET name = 'Executivo Smart Casual Faria Lima' WHERE id = '3db8f6dd-c838-4af5-8f36-3b37fc839f31';
UPDATE prompts SET name = 'Executiva Beige & Cream Luxo' WHERE id = '4425c3c5-34de-4f68-a90a-caa17680369e';
UPDATE prompts SET name = 'Retrato Poltrona Elegante' WHERE id = '8d688568-70d7-495e-9549-8de09f60bbe1';

-- 2. Rename duplicate "CEO" prompts
UPDATE prompts SET name = 'CEO Editorial Latino' WHERE id = '3a2a0043-5191-4274-931d-57f8e631c627';
UPDATE prompts SET name = 'CEO Retrato Hiper-Realista' WHERE id = '8b47b85b-62bb-4c0e-b702-96865e13e15f';

-- 3. Rename duplicate "Crie um retrato em"
UPDATE prompts SET name = 'Retrato Studio Canon R5 Masculino' WHERE id = '05709158-8643-4974-8764-ab342e02d19f';
UPDATE prompts SET name = 'Retrato Studio Canon R5 Feminino' WHERE id = 'e968123c-0760-4ec5-96c6-8147704f6169';

-- 4. Rename "Crie um retrato de" (generic)
UPDATE prompts SET name = 'Moda Blazer Preto Studio' WHERE id = '9ff00816-b877-42cb-b55a-caae23de79da';

-- 5. Rename "Fotografia de estúdio, plano"
UPDATE prompts SET name = 'Blazer Branco Elegante Studio' WHERE id = '089b13d7-cc27-41b6-9dc7-749992a0882d';

-- 6. Fix [INSERT YOUR FACE HERE] placeholders - replace with proper reference instruction
UPDATE prompts SET prompt_template = REPLACE(prompt_template, '[INSERT' || chr(10) || 'YOUR FACE HERE]', 'the person from the uploaded reference photo') WHERE prompt_template LIKE '%[INSERT%YOUR FACE HERE]%' AND status = 'active';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, '[INSERT YOUR FACE HERE]', 'the person from the uploaded reference photo') WHERE prompt_template LIKE '%[INSERT YOUR FACE HERE]%' AND status = 'active';

-- 7. Fix "Crie um retrato de" that says "mesmo homem atlético" - make gender neutral
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'do mesmo homem atlético', 'da mesma pessoa da foto de referência') WHERE id = '9ff00816-b877-42cb-b55a-caae23de79da';

-- 8. Fix "CEO Retrato Hiper-Realista" that says "homem de 1,83" - make neutral
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'de um homem de 1,83 com o mesmo rosto, cabelo, facial hair exactly as', 'da pessoa da foto de referência, preservando 100% o rosto, cabelo e todas as características faciais exactly as') WHERE id = '8b47b85b-62bb-4c0e-b702-96865e13e15f';

-- 9. Fix "Jovem CEO" that says "Homem jovem adulto" - make neutral  
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'de um Homem jovem adulto elegante', 'da pessoa da foto de referência, elegante') WHERE id = '18e9f61f-23e2-494e-b9f6-22079842a538';

-- 10. Fix "Fotografia de estúdio" that has fixed hair - already has "cabelo conforme a foto de referência" so just rename "Ela" to neutral
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'Ela está sentada ou agachada', 'A pessoa está sentada ou agachada') WHERE id = '089b13d7-cc27-41b6-9dc7-749992a0882d';
