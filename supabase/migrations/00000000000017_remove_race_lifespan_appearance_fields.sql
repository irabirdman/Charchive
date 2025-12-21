-- Remove lifespan_development and appearance_dress columns from world_races table
-- These fields have been consolidated into the info field

ALTER TABLE world_races
  DROP COLUMN IF EXISTS lifespan_development,
  DROP COLUMN IF EXISTS appearance_dress;

-- Update comment to reflect the change
COMMENT ON COLUMN world_races.info IS 'General information about the race (includes lifespan, development, appearance, dress, and any other relevant characteristics)';

