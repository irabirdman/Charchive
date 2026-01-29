-- fanfics (includes author, image_url)
CREATE TABLE IF NOT EXISTS fanfics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  rating TEXT CHECK (rating IN ('G', 'PG', 'PG-13', 'R', 'M', 'Not Rated')),
  alternative_titles TEXT[],
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  story_alias_id UUID REFERENCES story_aliases(id) ON DELETE SET NULL,
  external_link TEXT,
  author TEXT,
  image_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fanfics_slug ON fanfics(slug);
CREATE INDEX IF NOT EXISTS idx_fanfics_is_public ON fanfics(is_public);
CREATE INDEX IF NOT EXISTS idx_fanfics_world_id ON fanfics(world_id);
CREATE INDEX IF NOT EXISTS idx_fanfics_story_alias_id ON fanfics(story_alias_id);
CREATE INDEX IF NOT EXISTS idx_fanfics_rating ON fanfics(rating);
CREATE INDEX IF NOT EXISTS idx_fanfics_created_at ON fanfics(created_at);
ALTER TABLE fanfics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read public fanfics" ON fanfics;
CREATE POLICY "Public can read public fanfics" ON fanfics FOR SELECT TO public USING (is_public = true);
DROP POLICY IF EXISTS "Authenticated users can manage fanfics" ON fanfics;
CREATE POLICY "Authenticated users can manage fanfics" ON fanfics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION update_fanfics_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_fanfics_updated_at ON fanfics;
CREATE TRIGGER update_fanfics_updated_at BEFORE UPDATE ON fanfics FOR EACH ROW EXECUTE FUNCTION update_fanfics_updated_at();

-- fanfic_characters (oc_id nullable, name for custom characters)
CREATE TABLE IF NOT EXISTS fanfic_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fanfic_id UUID NOT NULL REFERENCES fanfics(id) ON DELETE CASCADE,
  oc_id UUID REFERENCES ocs(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(fanfic_id, oc_id)
);
CREATE INDEX IF NOT EXISTS idx_fanfic_characters_fanfic_id ON fanfic_characters(fanfic_id);
CREATE INDEX IF NOT EXISTS idx_fanfic_characters_oc_id ON fanfic_characters(oc_id);
ALTER TABLE fanfic_characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read fanfic characters" ON fanfic_characters;
CREATE POLICY "Public can read fanfic characters" ON fanfic_characters FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage fanfic characters" ON fanfic_characters;
CREATE POLICY "Authenticated users can manage fanfic characters" ON fanfic_characters FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- fanfic_relationships
CREATE TABLE IF NOT EXISTS fanfic_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fanfic_id UUID NOT NULL REFERENCES fanfics(id) ON DELETE CASCADE,
  relationship_text TEXT NOT NULL,
  relationship_type TEXT CHECK (relationship_type IN ('romantic', 'platonic', 'other')) DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fanfic_relationships_fanfic_id ON fanfic_relationships(fanfic_id);
ALTER TABLE fanfic_relationships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read fanfic relationships" ON fanfic_relationships;
CREATE POLICY "Public can read fanfic relationships" ON fanfic_relationships FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage fanfic relationships" ON fanfic_relationships;
CREATE POLICY "Authenticated users can manage fanfic relationships" ON fanfic_relationships FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- fanfic_tags
CREATE TABLE IF NOT EXISTS fanfic_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fanfic_id UUID NOT NULL REFERENCES fanfics(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(fanfic_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_fanfic_tags_fanfic_id ON fanfic_tags(fanfic_id);
CREATE INDEX IF NOT EXISTS idx_fanfic_tags_tag_id ON fanfic_tags(tag_id);
ALTER TABLE fanfic_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read fanfic tags" ON fanfic_tags;
CREATE POLICY "Public can read fanfic tags" ON fanfic_tags FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage fanfic tags" ON fanfic_tags;
CREATE POLICY "Authenticated users can manage fanfic tags" ON fanfic_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- fanfic_chapters (includes image_url)
CREATE TABLE IF NOT EXISTS fanfic_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fanfic_id UUID NOT NULL REFERENCES fanfics(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT,
  content TEXT,
  word_count INTEGER,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(fanfic_id, chapter_number)
);
CREATE INDEX IF NOT EXISTS idx_fanfic_chapters_fanfic_id ON fanfic_chapters(fanfic_id);
CREATE INDEX IF NOT EXISTS idx_fanfic_chapters_chapter_number ON fanfic_chapters(fanfic_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_fanfic_chapters_is_published ON fanfic_chapters(fanfic_id, is_published);
ALTER TABLE fanfic_chapters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published chapters" ON fanfic_chapters;
CREATE POLICY "Public can read published chapters" ON fanfic_chapters FOR SELECT TO public USING (
  is_published = true AND EXISTS (SELECT 1 FROM fanfics WHERE fanfics.id = fanfic_chapters.fanfic_id AND fanfics.is_public = true)
);
DROP POLICY IF EXISTS "Authenticated users can manage fanfic chapters" ON fanfic_chapters;
CREATE POLICY "Authenticated users can manage fanfic chapters" ON fanfic_chapters FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION update_fanfic_chapters_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_fanfic_chapters_updated_at ON fanfic_chapters;
CREATE TRIGGER update_fanfic_chapters_updated_at BEFORE UPDATE ON fanfic_chapters FOR EACH ROW EXECUTE FUNCTION update_fanfic_chapters_updated_at();
