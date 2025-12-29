-- Add alt_icon_url column to site_settings table
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS alt_icon_url TEXT;

