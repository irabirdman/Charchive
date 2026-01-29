-- Core: site_settings, admin_credentials

-- site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_name TEXT NOT NULL,
  website_description TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  alt_icon_url TEXT,
  site_url TEXT NOT NULL,
  author_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_single_row ON site_settings ((TRUE));
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;
CREATE POLICY "Authenticated users can update site settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can insert site settings" ON site_settings;
CREATE POLICY "Authenticated users can insert site settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE OR REPLACE FUNCTION update_site_settings_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_site_settings_updated_at();

-- admin_credentials
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No public access to admin credentials" ON admin_credentials;
CREATE POLICY "No public access to admin credentials" ON admin_credentials FOR ALL TO public USING (false) WITH CHECK (false);
CREATE OR REPLACE FUNCTION update_admin_credentials_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_admin_credentials_updated_at ON admin_credentials;
CREATE TRIGGER update_admin_credentials_updated_at BEFORE UPDATE ON admin_credentials FOR EACH ROW EXECUTE FUNCTION update_admin_credentials_updated_at();
