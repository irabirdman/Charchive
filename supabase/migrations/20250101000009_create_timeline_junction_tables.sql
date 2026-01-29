-- timeline_event_timelines
CREATE TABLE IF NOT EXISTS timeline_event_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id UUID NOT NULL REFERENCES timelines(id) ON DELETE CASCADE,
  timeline_event_id UUID NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(timeline_id, timeline_event_id)
);
CREATE INDEX IF NOT EXISTS idx_timeline_event_timelines_timeline_id ON timeline_event_timelines(timeline_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_timelines_event_id ON timeline_event_timelines(timeline_event_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_timelines_position ON timeline_event_timelines(position);
ALTER TABLE timeline_event_timelines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read timeline event timelines" ON timeline_event_timelines;
CREATE POLICY "Public can read timeline event timelines" ON timeline_event_timelines FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage timeline event timelines" ON timeline_event_timelines;
CREATE POLICY "Authenticated users can manage timeline event timelines" ON timeline_event_timelines FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- timeline_event_characters (custom_name, oc_id nullable, either required)
CREATE TABLE IF NOT EXISTS timeline_event_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_event_id UUID NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
  oc_id UUID REFERENCES ocs(id) ON DELETE CASCADE,
  role TEXT,
  custom_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT timeline_event_characters_oc_or_name_check CHECK (oc_id IS NOT NULL OR custom_name IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_timeline_event_characters_event_id ON timeline_event_characters(timeline_event_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_characters_oc_id ON timeline_event_characters(oc_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_timeline_event_characters_unique_oc ON timeline_event_characters(timeline_event_id, oc_id) WHERE oc_id IS NOT NULL;
ALTER TABLE timeline_event_characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read timeline event characters" ON timeline_event_characters;
CREATE POLICY "Public can read timeline event characters" ON timeline_event_characters FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage timeline event characters" ON timeline_event_characters;
CREATE POLICY "Authenticated users can manage timeline event characters" ON timeline_event_characters FOR ALL TO authenticated USING (true) WITH CHECK (true);
COMMENT ON COLUMN timeline_event_characters.custom_name IS 'Custom character name for characters not in the database. Either oc_id or custom_name must be provided.';
COMMENT ON COLUMN timeline_event_characters.oc_id IS 'Reference to OC in database. Nullable if custom_name is used instead.';
