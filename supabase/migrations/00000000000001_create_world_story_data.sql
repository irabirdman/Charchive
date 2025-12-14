-- Create world_story_data table for storing story-specific world information
-- This allows each story alias to have its own version of world content fields

CREATE TABLE IF NOT EXISTS world_story_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  story_alias_id UUID REFERENCES story_aliases(id) ON DELETE CASCADE,
  
  -- World content fields (story-specific versions)
  setting TEXT,
  lore TEXT,
  the_world_society TEXT,
  culture TEXT,
  politics TEXT,
  technology TEXT,
  environment TEXT,
  races_species TEXT,
  power_systems TEXT,
  religion TEXT,
  government TEXT,
  important_factions TEXT,
  notable_figures TEXT,
  languages TEXT,
  trade_economy TEXT,
  travel_transport TEXT,
  themes TEXT,
  inspirations TEXT,
  current_era_status TEXT,
  notes TEXT,
  
  -- World field system values (story-specific)
  modular_fields JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one entry per world per story alias (null story_alias_id = base world data)
  CONSTRAINT unique_world_story UNIQUE (world_id, story_alias_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_world_story_data_world_id ON world_story_data(world_id);
CREATE INDEX IF NOT EXISTS idx_world_story_data_story_alias_id ON world_story_data(story_alias_id);
CREATE INDEX IF NOT EXISTS idx_world_story_data_world_story ON world_story_data(world_id, story_alias_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_world_story_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_world_story_data_updated_at
  BEFORE UPDATE ON world_story_data
  FOR EACH ROW
  EXECUTE FUNCTION update_world_story_data_updated_at();

-- Add comment
COMMENT ON TABLE world_story_data IS 'Stores story-specific versions of world content fields. story_alias_id = null represents base world data.';
