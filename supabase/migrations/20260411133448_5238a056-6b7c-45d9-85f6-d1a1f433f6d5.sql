UPDATE public.prompts
SET prompt_template = prompt_template || E'\n\nREGRAS ABSOLUTAS:\n- Coloque a pessoa da foto de referência EXATAMENTE no cenário descrito\n- NÃO altere NENHUM traço facial: olhos, nariz, boca, queixo, testa, sobrancelhas\n- Clone 100% do rosto, tom de pele, textura da pele, cabelo (cor, comprimento, textura)\n- A foto de referência é a FONTE ABSOLUTA DA VERDADE para aparência física\n- IGNORE qualquer descrição textual que conflite com a foto real\n- NUNCA copie rosto, identidade, tom de pele ou traços da imagem de estilo/exemplo\n- Mantenha proporções corporais fiéis à pessoa real',
    updated_at = now()
WHERE status = 'active'
  AND prompt_template NOT LIKE '%REGRAS ABSOLUTAS%';