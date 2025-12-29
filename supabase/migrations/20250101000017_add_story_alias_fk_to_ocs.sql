-- Add foreign key constraints for story_alias_id in multiple tables
-- This is done in a separate migration because story_aliases table is created after these tables

-- Add FK to ocs table
ALTER TABLE ocs
  ADD CONSTRAINT fk_ocs_story_alias_id
  FOREIGN KEY (story_alias_id)
  REFERENCES story_aliases(id)
  ON DELETE SET NULL;

-- Add FK to timeline_events table
ALTER TABLE timeline_events
  ADD CONSTRAINT fk_timeline_events_story_alias_id
  FOREIGN KEY (story_alias_id)
  REFERENCES story_aliases(id)
  ON DELETE SET NULL;

-- Add FK to world_lore table
ALTER TABLE world_lore
  ADD CONSTRAINT fk_world_lore_story_alias_id
  FOREIGN KEY (story_alias_id)
  REFERENCES story_aliases(id)
  ON DELETE SET NULL;

