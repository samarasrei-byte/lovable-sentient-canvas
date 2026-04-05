
-- Round 4: Surgical cleanup of remaining specific physical traits

-- "short black natural wavy hair" in Retrato 4K Editorial
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'short black natural wavy hair,?\s*', 'hair exactly as in the reference photo, ', 'gi') WHERE id = '09291754-3ce5-481a-b4fd-f0ae73787e53';

-- "thick eyebrows" standalone
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*thick eyebrows?', ', eyebrows as in the reference photo', 'gi') WHERE id = '09291754-3ce5-481a-b4fd-f0ae73787e53';

-- Casais prompts: "turned slightly away" with gender markers
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'confident and calm expression,?\s*subtle stubble,?\s*', 'confident and calm expression, facial features exactly as in the reference photo, ', 'gi') WHERE id = 'ae13045e-4e69-40b2-a54d-bec1c34ff680';

-- "dark hair slightly wet" in Campeão
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'with dark hair slightly wet and tousled', 'with hair slightly wet and tousled (matching the reference photo)', 'gi') WHERE id = '575957cd-4338-4aa0-b1d9-869df872aeaf';

-- Remaining beard patterns across all prompts
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*subtle stubble', '', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%subtle stubble%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*light stubble', '', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%light stubble%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*thick beard', ', facial hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%thick beard%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*neatly groomed beard', ', facial hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%neatly groomed beard%';

-- "dark hair" remaining patterns
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, ',?\s*dark hair,?\s*', ', hair as in the reference photo, ', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%dark hair,%';
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, 'with dark hair\b', 'with hair as in the reference photo', 'gi') WHERE status = 'active' AND prompt_template ILIKE '%with dark hair%';

-- "KEEPING HIS EXACT" → neutral
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'KEEPING HIS EXACT', 'KEEPING THE EXACT') WHERE status = 'active' AND prompt_template LIKE '%KEEPING HIS EXACT%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'KEEPING HER EXACT', 'KEEPING THE EXACT') WHERE status = 'active' AND prompt_template LIKE '%KEEPING HER EXACT%';

-- "his expression" / "her expression"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'his expression', 'their expression') WHERE status = 'active' AND prompt_template LIKE '%his expression%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'her expression', 'their expression') WHERE status = 'active' AND prompt_template LIKE '%her expression%';

-- "man sitting" / "woman sitting" 
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'man sitting', 'person sitting') WHERE status = 'active' AND prompt_template ILIKE '%man sitting%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'woman sitting', 'person sitting') WHERE status = 'active' AND prompt_template ILIKE '%woman sitting%';

-- "man standing" / "woman standing"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'man standing', 'person standing') WHERE status = 'active' AND prompt_template ILIKE '%man standing%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'woman standing', 'person standing') WHERE status = 'active' AND prompt_template ILIKE '%woman standing%';

-- "man wearing" / "woman wearing"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'man wearing', 'person wearing') WHERE status = 'active' AND prompt_template ILIKE '%man wearing%';
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'woman wearing', 'person wearing') WHERE status = 'active' AND prompt_template ILIKE '%woman wearing%';
