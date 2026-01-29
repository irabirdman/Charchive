-- oc_identities
CREATE TABLE IF NOT EXISTS oc_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_oc_identities_name ON oc_identities(name);
CREATE INDEX IF NOT EXISTS idx_oc_identities_created_at ON oc_identities(created_at);
ALTER TABLE oc_identities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read oc identities" ON oc_identities;
CREATE POLICY "Public can read oc identities" ON oc_identities FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage oc identities" ON oc_identities;
CREATE POLICY "Authenticated users can manage oc identities" ON oc_identities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION update_oc_identities_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_oc_identities_updated_at ON oc_identities;
CREATE TRIGGER update_oc_identities_updated_at BEFORE UPDATE ON oc_identities FOR EACH ROW EXECUTE FUNCTION update_oc_identities_updated_at();
