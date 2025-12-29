import { createAdminClient } from '@/lib/supabase/server';
import siteConfigFile from '../../../site-config.json';

export interface SiteConfig {
  websiteName: string;
  websiteDescription: string;
  iconUrl: string;
  siteUrl: string;
  authorName: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
}

interface SiteSettingsRow {
  id: string;
  website_name: string;
  website_description: string;
  icon_url: string;
  site_url: string;
  author_name: string;
  short_name: string;
  theme_color: string;
  background_color: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get site configuration from database, falling back to config file
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    // If database has settings, use them
    if (data && !error) {
      return {
        websiteName: data.website_name || siteConfigFile.websiteName,
        websiteDescription: data.website_description || siteConfigFile.websiteDescription,
        iconUrl: data.icon_url || siteConfigFile.iconUrl,
        siteUrl: data.site_url || siteConfigFile.siteUrl,
        authorName: data.author_name || siteConfigFile.authorName,
        shortName: data.short_name || siteConfigFile.shortName,
        themeColor: data.theme_color || siteConfigFile.themeColor,
        backgroundColor: data.background_color || siteConfigFile.backgroundColor,
      };
    }
  } catch (error) {
    // If table doesn't exist or other error, fall back to file
    console.warn('Could not fetch site settings from database, using config file:', error);
  }

  // Fall back to config file
  return siteConfigFile as SiteConfig;
}


