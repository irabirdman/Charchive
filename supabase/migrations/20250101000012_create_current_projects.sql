-- current_projects
CREATE TABLE IF NOT EXISTS current_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  project_items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS current_projects_single_row ON current_projects ((TRUE));
ALTER TABLE current_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read current projects" ON current_projects;
CREATE POLICY "Public can read current projects" ON current_projects FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage current projects" ON current_projects;
CREATE POLICY "Authenticated users can manage current projects" ON current_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION update_current_projects_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_current_projects_updated_at ON current_projects;
CREATE TRIGGER update_current_projects_updated_at BEFORE UPDATE ON current_projects FOR EACH ROW EXECUTE FUNCTION update_current_projects_updated_at();
