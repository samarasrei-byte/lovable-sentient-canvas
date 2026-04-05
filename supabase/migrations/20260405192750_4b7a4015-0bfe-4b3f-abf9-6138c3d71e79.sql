
-- FINAL DEFINITIVE CLEANUP: Use regexp_replace to catch ALL remaining instances

-- All "beard" patterns (including "full beard", "groomed beard", "short beard", etc.)
UPDATE prompts 
SET prompt_template = REGEXP_REPLACE(prompt_template, E'[,.]?\\s*(short |full |thick |neatly groomed |well-groomed |trimmed |neat )?beard\\b', ', facial hair as in the reference photo', 'gi')
WHERE status = 'active' AND prompt_template ~* 'beard';

-- All "stubble" patterns
UPDATE prompts 
SET prompt_template = REGEXP_REPLACE(prompt_template, E'[,.]?\\s*(subtle |light |heavy )?stubble\\b', '', 'gi')
WHERE status = 'active' AND prompt_template ~* 'stubble';

-- All "blonde" / "blond" patterns  
UPDATE prompts 
SET prompt_template = REGEXP_REPLACE(prompt_template, E'(platinum |honey |dirty |strawberry |light )?blond(e)?\\b', 'hair color as in the reference photo', 'gi')
WHERE status = 'active' AND prompt_template ~* 'blond';

-- All "dark hair" patterns
UPDATE prompts 
SET prompt_template = REGEXP_REPLACE(prompt_template, E',?\\s*dark hair\\b', ', hair as in the reference photo', 'gi')
WHERE status = 'active' AND prompt_template ~* 'dark hair';

-- "young man" remaining
UPDATE prompts 
SET prompt_template = REGEXP_REPLACE(prompt_template, E'\\byoung man\\b', 'person from the reference photo', 'gi')
WHERE status = 'active' AND prompt_template ~* 'young man';

-- "BEARD" uppercase
UPDATE prompts 
SET prompt_template = REGEXP_REPLACE(prompt_template, E'BEARD', 'FACIAL HAIR AS IN REFERENCE', 'g')
WHERE status = 'active' AND prompt_template LIKE '%BEARD%';
