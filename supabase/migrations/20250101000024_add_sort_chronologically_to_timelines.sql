-- Persist timeline event sort preference: when true, public view orders events by date
ALTER TABLE timelines
ADD COLUMN IF NOT EXISTS sort_chronologically BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN timelines.sort_chronologically IS 'When true, events are shown in chronological order by date on the public timeline; when false, by position (order added).';
