-- Add category field to tags table to distinguish tag types
ALTER TABLE tags ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'character';

-- Set default category for existing tags (assume they're character tags)
UPDATE tags SET category = 'character' WHERE category IS NULL;

-- Add check constraint (drop first if exists, then add)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tags_category_check') THEN
    ALTER TABLE tags DROP CONSTRAINT tags_category_check;
  END IF;
END $$;

ALTER TABLE tags ADD CONSTRAINT tags_category_check CHECK (category IN ('character', 'fanfic', 'general'));

-- Create index for category
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);

-- Seed default fanfiction tags
INSERT INTO tags (name, category, description) VALUES
  ('Angst', 'fanfic', 'Stories with emotional pain and suffering'),
  ('Fluff', 'fanfic', 'Light, sweet, happy stories'),
  ('Hurt/Comfort', 'fanfic', 'Stories involving physical or emotional hurt followed by comfort'),
  ('Smut', 'fanfic', 'Explicit sexual content'),
  ('Slice of Life', 'fanfic', 'Everyday life stories'),
  ('Action', 'fanfic', 'Stories with lots of action and adventure'),
  ('Drama', 'fanfic', 'Serious, plot-driven stories'),
  ('Comedy', 'fanfic', 'Humorous stories'),
  ('Romance', 'fanfic', 'Love stories'),
  ('Friendship', 'fanfic', 'Stories focusing on friendships'),
  ('Family', 'fanfic', 'Stories about family relationships'),
  ('AU (Alternate Universe)', 'fanfic', 'Stories set in alternate universes'),
  ('Canon Divergent', 'fanfic', 'Stories that diverge from canon'),
  ('Fix-It', 'fanfic', 'Stories that fix canon events'),
  ('Time Travel', 'fanfic', 'Stories involving time travel'),
  ('Slow Burn', 'fanfic', 'Stories with slow-developing relationships'),
  ('Established Relationship', 'fanfic', 'Stories with already-established relationships'),
  ('First Time', 'fanfic', 'First time experiences'),
  ('Friends to Lovers', 'fanfic', 'Friendship developing into romance'),
  ('Enemies to Lovers', 'fanfic', 'Enemies developing into romance'),
  ('Mutual Pining', 'fanfic', 'Both characters pining for each other'),
  ('Unrequited Love', 'fanfic', 'One-sided love'),
  ('Love Triangle', 'fanfic', 'Romantic triangle situations'),
  ('Polyamory', 'fanfic', 'Multiple romantic relationships'),
  ('Coming of Age', 'fanfic', 'Stories about growing up'),
  ('Dark', 'fanfic', 'Dark themes and content'),
  ('Tragedy', 'fanfic', 'Tragic stories'),
  ('Major Character Death', 'fanfic', 'Stories with major character deaths'),
  ('Minor Character Death', 'fanfic', 'Stories with minor character deaths'),
  ('No Archive Warnings Apply', 'fanfic', 'No major warnings needed'),
  ('Creator Chose Not To Use Archive Warnings', 'fanfic', 'Creator chose not to warn'),
  ('Graphic Depictions Of Violence', 'fanfic', 'Contains graphic violence'),
  ('Rape/Non-Con', 'fanfic', 'Contains non-consensual content'),
  ('Underage', 'fanfic', 'Contains underage content'),
  ('Plot What Plot', 'fanfic', 'Porn without plot'),
  ('Crack', 'fanfic', 'Silly, absurd stories'),
  ('Crack Treated Seriously', 'fanfic', 'Absurd premise treated seriously'),
  ('Crossover', 'fanfic', 'Stories combining multiple fandoms'),
  ('Fusion', 'fanfic', 'Stories fusing elements from multiple fandoms'),
  ('Podfic', 'fanfic', 'Audio recording of a story'),
  ('Podfic Available', 'fanfic', 'Has audio version available'),
  ('Series', 'fanfic', 'Part of a series'),
  ('One Shot', 'fanfic', 'Single chapter story'),
  ('Multi-Chapter', 'fanfic', 'Story with multiple chapters'),
  ('Complete', 'fanfic', 'Finished story'),
  ('Incomplete', 'fanfic', 'Unfinished story'),
  ('Abandoned', 'fanfic', 'Story abandoned by author'),
  ('Oneshot', 'fanfic', 'Single chapter story (alternate spelling)')
ON CONFLICT (name) DO NOTHING;

-- Add comment
COMMENT ON COLUMN tags.category IS 'Tag category: character (for OC tags), fanfic (for fanfiction tags), or general';

