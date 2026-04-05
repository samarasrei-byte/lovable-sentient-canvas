
-- ABSOLUTE FINAL: Fix each remaining prompt individually

-- ae13045e: "short styled haircut beard"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'short styled haircut beard,\\s*well-groomed,\\s*masculine clean look', 'haircut and facial hair as in the reference photo, clean look', 'gi') WHERE id = 'ae13045e-4e69-40b2-a54d-bec1c34ff680';

-- 3c23951d: "foreground subject: young man"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'foreground subject: young man', 'foreground subject: person from reference photo 1') WHERE id = '3c23951d-d48e-4a61-b67a-7196a9d92cb0';

-- 45021441: "blonde hair with soft waves"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'blonde hair with soft waves', 'hair as in the reference photo', 'gi') WHERE id = '45021441-008c-4dbc-b996-248be60cd7ec';

-- 575957cd: "detailed beard texture"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'detailed beard texture', 'detailed facial texture') WHERE id = '575957cd-4338-4aa0-b1d9-869df872aeaf';

-- 24dc5661: "hair, and beard, and creates reflections"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'hair, and beard, and creates', 'hair, and facial features, and creates') WHERE id = '24dc5661-1ebf-4830-8997-fc9d918614a2';

-- 502c7800: "short groomed stubble beard"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'short groomed stubble beard', 'facial hair as in the reference photo', 'gi') WHERE id = '502c7800-7f82-4e52-bc53-0ea590fc80e4';

-- 2917c9af: "beard texture, and dramatic contrast"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'beard texture, and dramatic', 'facial texture, and dramatic') WHERE id = '2917c9af-672a-4e51-b6cd-a91f676bbcf3';

-- 05ec56a7: "subtle natural stubble beard"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'subtle natural stubble beard', 'facial hair as in the reference photo', 'gi') WHERE id = '05ec56a7-948c-415f-bbc9-06f48ee09827';

-- 49879fa3: "skin, beard and clothing"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'skin, beard and clothing', 'skin, facial features and clothing') WHERE id = '49879fa3-827f-402a-8334-5f55e22b409c';

-- 97e41822: "face and beard, casting deep shadows. He wears"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'face and beard, casting deep shadows. He wears', 'face and facial features, casting deep shadows. The person wears') WHERE id = '97e41822-9ed8-4ad1-b5b2-7157ae12ee40';

-- deeeb655: "pink dress, long blonde hair, small crown on her head"
UPDATE prompts SET prompt_template = REGEXP_REPLACE(prompt_template, E'pink dress, long blonde hair, small crown on her head', 'outfit and hair as in the reference photo', 'gi') WHERE id = 'deeeb655-2a2e-4499-b893-b7b8fbadeb1d';

-- 825bbc07: "young man with short hair"
UPDATE prompts SET prompt_template = REPLACE(prompt_template, 'young man with short hair', 'person with hair exactly') WHERE id = '825bbc07-1b4e-4e60-ba0c-02074d60bd5a';
