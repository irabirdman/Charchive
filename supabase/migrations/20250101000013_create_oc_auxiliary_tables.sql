-- character_quotes
CREATE TABLE IF NOT EXISTS character_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oc_id UUID NOT NULL REFERENCES ocs(id) ON DELETE CASCADE,
  quote_text TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_character_quotes_oc_id ON character_quotes(oc_id);
CREATE OR REPLACE FUNCTION update_character_quotes_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_character_quotes_updated_at ON character_quotes;
CREATE TRIGGER update_character_quotes_updated_at BEFORE UPDATE ON character_quotes FOR EACH ROW EXECUTE FUNCTION update_character_quotes_updated_at();

-- tags (with category for character/fanfic/general)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  category TEXT DEFAULT 'character' CHECK (category IN ('character', 'fanfic', 'general')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE OR REPLACE FUNCTION update_tags_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_tags_updated_at();
COMMENT ON COLUMN tags.color IS 'Optional hex color code for tag display';
COMMENT ON COLUMN tags.category IS 'Tag category: character (for OC tags), fanfic (for fanfiction tags), or general';

-- character_tags
CREATE TABLE IF NOT EXISTS character_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oc_id UUID NOT NULL REFERENCES ocs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(oc_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_character_tags_oc_id ON character_tags(oc_id);
CREATE INDEX IF NOT EXISTS idx_character_tags_tag_id ON character_tags(tag_id);

-- character_development_log
CREATE TABLE IF NOT EXISTS character_development_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oc_id UUID NOT NULL REFERENCES ocs(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_character_development_log_oc_id ON character_development_log(oc_id);
CREATE INDEX IF NOT EXISTS idx_character_development_log_created_at ON character_development_log(oc_id, created_at DESC);

-- story_snippets
CREATE TABLE IF NOT EXISTS story_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oc_id UUID NOT NULL REFERENCES ocs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  snippet_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_story_snippets_oc_id ON story_snippets(oc_id);
CREATE OR REPLACE FUNCTION update_story_snippets_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_story_snippets_updated_at ON story_snippets;
CREATE TRIGGER update_story_snippets_updated_at BEFORE UPDATE ON story_snippets FOR EACH ROW EXECUTE FUNCTION update_story_snippets_updated_at();
