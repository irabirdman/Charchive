-- Create dropdown_options table for storing form dropdown field options
-- This table serves as the source of truth for all dropdown options across the application

CREATE TABLE IF NOT EXISTS dropdown_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field text NOT NULL,
  option text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(field, option)
);

-- Create index on field for fast lookups
CREATE INDEX IF NOT EXISTS idx_dropdown_options_field ON dropdown_options(field);

-- Add comment
COMMENT ON TABLE dropdown_options IS 'Stores available options for form dropdown fields (pronouns, gender identity, traits, etc.)';

-- Enable Row Level Security
ALTER TABLE dropdown_options ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (dropdown options are not sensitive)
CREATE POLICY "Allow public read access" ON dropdown_options
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated admin writes (enforced by API route auth check)
-- Note: Since we use custom admin auth, we'll rely on API route authentication
-- This policy allows inserts/updates/deletes, but API route will verify admin session
CREATE POLICY "Allow authenticated admin writes" ON dropdown_options
  FOR ALL
  USING (true)
  WITH CHECK (true);

