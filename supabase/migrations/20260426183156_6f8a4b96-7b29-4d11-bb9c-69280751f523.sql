-- Update prompt templates for Foto Infantil to use the MASTER FACE LOCK structure
UPDATE public.prompts
SET prompt_template = '[REFERENCE IMAGE - MASTER FACE LOCK]
KEEP EXACT SAME FACE, SAME IDENTITY, SAME FACIAL STRUCTURE.
PRESERVE ALL UNIQUE FACIAL DETAILS (eyes, nose, mouth, skin texture).
IDENTITY FIDELITY IS THE HIGHEST PRIORITY.

---
SCENE:
Retrato realista e colorido de uma criança de aproximadamente {age}, preservando os traços faciais originais. A pessoa está em pé, sorridente, segurando um boneco de pelúcia do Patrick Estrela. A criança veste uma jaqueta jeans decorada com patches do Bob Esponja e camiseta amarela. O cenário é o fundo do mar do desenho Bob Esponja, com a casa de abacaxi e corais coloridos. A idade "{age}" DEVE aparecer visível no cenário em um balão ou placa.

---
QUALITY:
Ultra-realistic, sharp focus, 8k, professional lighting.
--ar 4:5 --style raw'
WHERE id = 'e147d0b9-613e-4b12-ae01-4e1398ca41d6';

UPDATE public.prompts
SET prompt_template = '[REFERENCE IMAGE - MASTER FACE LOCK]
KEEP EXACT SAME FACE, SAME IDENTITY, SAME FACIAL STRUCTURE.
PRESERVE ALL UNIQUE FACIAL DETAILS.
IDENTITY FIDELITY IS THE HIGHEST PRIORITY.

---
SCENE:
Imagem hiper-realista de uma criança de {age} com chapéu de aviador marrom e óculos de couro, sentada entre nuvens brancas de algodão. Cenário com fundo azul-claro decorado com aviões de brinquedo. A idade "{age}" DEVE aparecer visível no cenário em uma placa decorativa ou elemento do cenário.

---
QUALITY:
Ultra-realistic, 8k, soft cinematic lighting, professional studio photography.
--ar 4:5 --style raw'
WHERE id = 'f3f4995d-4d4b-44e1-94fa-42aad7bf17ef';

-- Apply a similar structure to other Foto Infantil prompts if they exist
UPDATE public.prompts
SET prompt_template = '[REFERENCE IMAGE - MASTER FACE LOCK]
KEEP EXACT SAME FACE, SAME IDENTITY, SAME FACIAL STRUCTURE.
IDENTITY FIDELITY IS THE HIGHEST PRIORITY.

---
SCENE:
' || prompt_template || '

---
QUALITY:
Ultra-realistic, sharp focus, 8k.
--ar 4:5 --style raw'
WHERE category = 'Foto Infantil' 
AND prompt_template NOT LIKE '%MASTER FACE LOCK%';
