
-- Adiciona campo "age" aos prompts da Foto Infantil cujo template menciona idade/aniversário
UPDATE public.prompts
SET required_fields = (
  CASE
    WHEN required_fields::text ILIKE '%age%' THEN required_fields
    ELSE (required_fields::jsonb || '["age"]'::jsonb)
  END
)
WHERE id IN (
  'b0195584-84fd-4ba2-82ae-1e2e7d0e99bf',
  'f3f4995d-4d4b-44e1-94fa-42aad7bf17ef',
  'b9e02390-46da-4242-b9de-98aef4816949',
  '9fbbd848-ff2c-4849-9d98-422eac8c0ef5',
  'e147d0b9-613e-4b12-ae01-4e1398ca41d6'
);
