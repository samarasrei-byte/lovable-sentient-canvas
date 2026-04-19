-- 1. Em prompts de bebê/newborn/mêsversário/baby: troca {age} por {months}
UPDATE public.prompts
SET prompt_template = REPLACE(prompt_template, '{age}', '{months}')
WHERE (
  name ILIKE '%bebê%' OR name ILIKE '%bebe%' OR name ILIKE '%newborn%'
  OR name ILIKE '%mêsversário%' OR name ILIKE '%mesversario%'
  OR name ILIKE '%berço%' OR name ILIKE '%banho fofo%'
  OR name ILIKE '%sono%' OR name ILIKE '%spa%'
)
AND prompt_template LIKE '%{age}%';

-- 2. Em prompts de criança/infantil/aniversário: troca {age} por {years}
UPDATE public.prompts
SET prompt_template = REPLACE(prompt_template, '{age}', '{years}')
WHERE (
  category ILIKE '%infantil%' 
  OR name ILIKE '%infantil%' 
  OR name ILIKE '%aniversário%' OR name ILIKE '%aniversario%'
  OR name ILIKE '%criança%' OR name ILIKE '%crianca%'
)
AND prompt_template LIKE '%{age}%';

-- 3. Garante que prompts infantis tenham 'name' obrigatório
UPDATE public.prompts
SET required_fields = (
  CASE 
    WHEN required_fields::text NOT LIKE '%"name"%' 
    THEN (required_fields::jsonb || '["name"]'::jsonb)
    ELSE required_fields::jsonb
  END
)
WHERE (category ILIKE '%infantil%' OR name ILIKE '%bebê%' OR name ILIKE '%bebe%' OR name ILIKE '%criança%');