
-- FINAL SURGICAL: Fix remaining by broader context patterns

-- "contoured beard" / "soul patch beard" / "groomed dark beard" / "skin texture beard"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'(contoured|soul patch|groomed dark|skin texture|full|dark|trimmed|short|neat|perfectly groomed)\\s*beard', 'facial hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ~* 'beard';

-- Any remaining standalone "beard"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'\\bbeard\\b', 'facial hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ~* '\\bbeard\\b';

-- "SHORT DARK HAIR FADE HAIRCUT"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'SHORT DARK HAIR FADE HAIRCUT', 'HAIR EXACTLY AS IN REFERENCE PHOTO', 'g') WHERE status = 'active' AND prompt_template LIKE '%SHORT DARK HAIR FADE HAIRCUT%';

-- "dark blonde depending on input"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'natural brown / dark blonde depending on input', 'hair color exactly as in the reference photos', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark blonde depending%';

-- "young man" remaining  
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'\\byoung man\\b', 'person from the reference photo', 'gi') WHERE status = 'active' AND prompt_template ~* '\\byoung man\\b';

-- "dark hair" remaining
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'dark hair', 'hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ~* 'dark hair';

-- "male styling" / "female styling"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'male styling', 'styling as appropriate', 'gi') WHERE status = 'active' AND prompt_template ~* 'male styling';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'female styling', 'styling as appropriate', 'gi') WHERE status = 'active' AND prompt_template ~* 'female styling';
