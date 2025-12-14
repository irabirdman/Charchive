-- Add world_fields column to world_lore table
-- This column stores world field definitions (field sets) for lore entries
-- Similar to how worlds table has world_fields for storing field definitions

ALTER TABLE world_lore
  ADD COLUMN IF NOT EXISTS world_fields JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN world_lore.world_fields IS 'World field definitions (field sets) for this lore entry. Stores the same structure as worlds.world_fields: { field_sets: FieldSet[] }';

