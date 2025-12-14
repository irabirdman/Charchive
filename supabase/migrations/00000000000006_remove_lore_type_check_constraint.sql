-- Remove the CHECK constraint on lore_type to allow custom values
-- The application form allows users to enter custom lore types,
-- so the constraint should not restrict values to a fixed set

ALTER TABLE world_lore
  DROP CONSTRAINT IF EXISTS world_lore_lore_type_check;

-- Add comment for documentation
COMMENT ON COLUMN world_lore.lore_type IS 'Type of lore entry. Common values: clan, organization, location, religion, species, technique, concept, artifact, other. Custom values are allowed.';

