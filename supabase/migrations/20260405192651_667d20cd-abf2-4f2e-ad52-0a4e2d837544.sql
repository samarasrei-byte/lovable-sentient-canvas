
-- Round 3: Final cleanup of remaining 20 prompts

-- "a mature man"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'of a mature man (based on a reference image)', 'of the person from the reference photo') WHERE status = 'active' AND prompt_template ILIKE '%a mature man%';

-- "SAME MALE IDENTITY"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'SAME MALE IDENTITY', 'SAME IDENTITY') WHERE status = 'active' AND prompt_template LIKE '%SAME MALE IDENTITY%';

-- "a contemplative and sophisticated male figure"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'a uploaded person with a contemplative and sophisticated', 'the uploaded person with a contemplative and sophisticated') WHERE status = 'active' AND id = '24dc5661-1ebf-4830-8997-fc9d918614a2';

-- Casais prompts: "female and male" remaining instances  
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'subjects (female and male)', 'subjects (matching reference photos)') WHERE status = 'active' AND prompt_template ILIKE '%subjects (female and male)%';

-- "the male subject" in casais
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'the male subject', 'subject 1') WHERE status = 'active' AND prompt_template ILIKE '%the male subject%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'the female subject', 'subject 2') WHERE status = 'active' AND prompt_template ILIKE '%the female subject%';

-- "a real person" with gender
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'taken by a real person sitting', 'taken by the person from the reference photo sitting') WHERE status = 'active' AND id = 'deeeb655-2a2e-4499-b893-b7b8fbadeb1d';

-- "HIS LEG" uppercase
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'WITH HIS LEG', 'WITH THEIR LEG') WHERE status = 'active' AND prompt_template LIKE '%WITH HIS LEG%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'HIS LEGS', 'THEIR LEGS') WHERE status = 'active' AND prompt_template LIKE '%HIS LEGS%';

-- beard residuals
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*short beard', ', facial hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%short beard%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*well-groomed beard', ', facial hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%well-groomed beard%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'with a full beard', 'with facial hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%with a full beard%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'trimmed beard', 'facial hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%trimmed beard%';

-- Dark hair residuals  
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*dark wavy hair', ', hair exactly as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark wavy hair%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'dark slicked-back hair', 'hair styled as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark slicked-back hair%';

-- "woman" in couple contexts
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'the woman leans', 'person 2 leans') WHERE status = 'active' AND prompt_template ILIKE '%the woman leans%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'the man holds', 'person 1 holds') WHERE status = 'active' AND prompt_template ILIKE '%the man holds%';

-- Rename last duplicates
UPDATE prompts SET name = 'Retrato Maduro Estilo Executivo' WHERE id = '49879fa3-827f-402a-8334-5f55e22b409c' AND name = 'Portrait Style';
