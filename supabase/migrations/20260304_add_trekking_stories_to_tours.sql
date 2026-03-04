ALTER TABLE tours ADD COLUMN IF NOT EXISTS trekking_stories jsonb DEFAULT '[]';
