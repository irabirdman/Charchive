-- Create fanfic_chapters table
CREATE TABLE IF NOT EXISTS fanfic_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fanfic_id UUID NOT NULL REFERENCES fanfics(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT,
  content TEXT, -- Full chapter content (markdown supported)
  word_count INTEGER, -- Optional: calculated word count
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(fanfic_id, chapter_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fanfic_chapters_fanfic_id ON fanfic_chapters(fanfic_id);
CREATE INDEX IF NOT EXISTS idx_fanfic_chapters_chapter_number ON fanfic_chapters(fanfic_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_fanfic_chapters_is_published ON fanfic_chapters(fanfic_id, is_published);

-- Enable RLS
ALTER TABLE fanfic_chapters ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can read published chapters of public fanfics
DROP POLICY IF EXISTS "Public can read published chapters" ON fanfic_chapters;
CREATE POLICY "Public can read published chapters"
  ON fanfic_chapters
  FOR SELECT
  TO public
  USING (
    is_published = true 
    AND EXISTS (
      SELECT 1 FROM fanfics 
      WHERE fanfics.id = fanfic_chapters.fanfic_id 
      AND fanfics.is_public = true
    )
  );

-- RLS Policy: Authenticated users can manage (admin only)
DROP POLICY IF EXISTS "Authenticated users can manage fanfic chapters" ON fanfic_chapters;
CREATE POLICY "Authenticated users can manage fanfic chapters"
  ON fanfic_chapters
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fanfic_chapters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_fanfic_chapters_updated_at ON fanfic_chapters;
CREATE TRIGGER update_fanfic_chapters_updated_at
  BEFORE UPDATE ON fanfic_chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_fanfic_chapters_updated_at();

-- Add comments for documentation
COMMENT ON TABLE fanfic_chapters IS 'Chapters within fanfiction works';
COMMENT ON COLUMN fanfic_chapters.chapter_number IS 'Chapter number (1-indexed) within the fanfic';
COMMENT ON COLUMN fanfic_chapters.content IS 'Full chapter content (supports markdown)';
COMMENT ON COLUMN fanfic_chapters.is_published IS 'Whether the chapter is published and visible to the public';
COMMENT ON COLUMN fanfic_chapters.published_at IS 'Timestamp when the chapter was published';

