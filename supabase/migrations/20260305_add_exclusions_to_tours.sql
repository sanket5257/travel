ALTER TABLE tours ADD COLUMN IF NOT EXISTS exclusions jsonb DEFAULT '[]'::jsonb;
