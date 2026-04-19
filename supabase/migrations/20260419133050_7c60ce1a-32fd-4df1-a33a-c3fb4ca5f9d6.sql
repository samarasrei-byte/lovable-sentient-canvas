-- Auditoria final dos prompts infantis: remover "age" desnecessário
-- Mantém "age" apenas em prompts onde a idade é parte essencial: Aniversário do Bebê, Flyer Festa do Bebê, Futebol Infantil
UPDATE public.prompts
SET required_fields = (
  SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
  FROM jsonb_array_elements(required_fields::jsonb) elem
  WHERE elem::text <> '"age"'
)
WHERE category ILIKE '%infantil%'
  AND name NOT IN ('Aniversário do Bebê', 'Flyer Festa do Bebê', 'Futebol Infantil')
  AND (required_fields::jsonb) ? 'age';

-- Garantir que TODOS os prompts infantis tenham "name" para coletar o nome da criança
UPDATE public.prompts
SET required_fields = (required_fields::jsonb || '["name"]'::jsonb)
WHERE category ILIKE '%infantil%'
  AND NOT ((required_fields::jsonb) ? 'name');