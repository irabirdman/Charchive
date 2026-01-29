-- Add custom_name column to timeline_event_characters if it doesn't exist
ALTER TABLE timeline_event_characters 
ADD COLUMN IF NOT EXISTS custom_name TEXT;

COMMENT ON COLUMN timeline_event_characters.custom_name IS 'Custom character name for characters not in the database. Either oc_id or custom_name must be provided.';
