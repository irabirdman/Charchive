-- Create current_projects table for storing the current projects section content
-- This table stores the description and project items for the homepage

CREATE TABLE IF NOT EXISTS current_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL DEFAULT '',
  project_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  singleton boolean NOT NULL DEFAULT true,
  CONSTRAINT current_projects_singleton CHECK (singleton = true),
  CONSTRAINT current_projects_single_row UNIQUE (singleton)
);

-- Add comment
COMMENT ON TABLE current_projects IS 'Stores the current projects section content for the homepage';

-- Enable Row Level Security
ALTER TABLE current_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access" ON current_projects
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated admin writes (enforced by API route auth check)
CREATE POLICY "Allow authenticated admin writes" ON current_projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default row
INSERT INTO current_projects (description, project_items, singleton)
VALUES (
  'Welcome to Ruutulian! Ruu''s personal OC wiki for organizing and storing information on her original characters, worlds, lore, and timelines across various universes.',
  '[
    {
      "title": "World Building",
      "description": "Creating and expanding unique worlds and universes",
      "icon": "fas fa-globe",
      "color": "purple"
    },
    {
      "title": "Character Development",
      "description": "Developing rich characters with detailed backstories",
      "icon": "fas fa-users",
      "color": "pink"
    }
  ]'::jsonb,
  true
)
ON CONFLICT (singleton) DO NOTHING;

