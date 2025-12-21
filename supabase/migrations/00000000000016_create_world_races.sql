-- Create world_races table for structured race/species information
-- Each race can have multiple fields: info, picture, lifespan & development, appearance & dress
-- Supports story-specific races via story_alias_id

CREATE TABLE IF NOT EXISTS world_races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  story_alias_id UUID REFERENCES story_aliases(id) ON DELETE CASCADE,
  
  -- Race information fields
  name TEXT NOT NULL,
  info TEXT,
  picture_url TEXT,
  
  -- Ordering
  position INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique race names per world/story combination
  CONSTRAINT unique_race_name_per_world_story UNIQUE (world_id, story_alias_id, name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_world_races_world_id ON world_races(world_id);
CREATE INDEX IF NOT EXISTS idx_world_races_story_alias_id ON world_races(story_alias_id);
CREATE INDEX IF NOT EXISTS idx_world_races_world_story ON world_races(world_id, story_alias_id);
CREATE INDEX IF NOT EXISTS idx_world_races_position ON world_races(world_id, story_alias_id, position);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_world_races_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS trigger_update_world_races_updated_at ON world_races;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_world_races_updated_at
  BEFORE UPDATE ON world_races
  FOR EACH ROW
  EXECUTE FUNCTION update_world_races_updated_at();

-- Add comments for documentation
COMMENT ON TABLE world_races IS 'Stores structured race/species information for worlds. story_alias_id = null represents base world races.';
COMMENT ON COLUMN world_races.name IS 'Name of the race/species';
COMMENT ON COLUMN world_races.info IS 'General information about the race (includes lifespan, development, appearance, dress, etc.)';
COMMENT ON COLUMN world_races.picture_url IS 'URL to an image representing this race';
COMMENT ON COLUMN world_races.position IS 'Ordering position for displaying races (lower numbers first)';
COMMENT ON COLUMN world_races.story_alias_id IS 'Optional story alias ID for story-specific race variants. NULL = base world race.';

-- Seed data example (commented out - uncomment and modify as needed)
-- Note: Replace 'YOUR_WORLD_ID' with an actual world ID from your database
/*
INSERT INTO world_races (world_id, name, info, picture_url, position)
VALUES 
  (
    'YOUR_WORLD_ID',
    'Humans',
    'The most common and adaptable race in the world. Humans are known for their diversity, ambition, and ability to thrive in various environments. They typically live 70-100 years, reaching physical maturity around 18-20 years of age. Humans display a wide variety of physical appearances based on their geographic and cultural origins. Clothing styles vary greatly by region, from simple rural garments to elaborate urban fashion.',
    'https://example.com/humans.jpg',
    0
  ),
  (
    'YOUR_WORLD_ID',
    'Elves',
    'A graceful and long-lived race with deep connections to nature and magic. Elves are known for their wisdom, beauty, and mastery of arcane arts. They can live for several centuries, with some reaching over 1000 years. They mature slowly, reaching adulthood around 100 years old, but maintain their youthful appearance for most of their lives. Elves are typically tall and slender with pointed ears and ethereal beauty. They favor elegant, flowing garments made from natural materials.',
    'https://example.com/elves.jpg',
    1
  ),
  (
    'YOUR_WORLD_ID',
    'Dwarves',
    'A sturdy and industrious race known for their craftsmanship, mining skills, and strong sense of community. Dwarves are masters of metalwork and stone carving. They live for 200-300 years, reaching maturity around 50 years old. Dwarves are shorter and stockier than humans, with broad shoulders and strong builds. They typically have thick beards and hair. Their clothing is practical and durable, often made from leather and metal.',
    'https://example.com/dwarves.jpg',
    2
  );
*/
