import { createAdminClient } from '@/lib/supabase/server';
import { errorResponse, successResponse, handleError } from '@/lib/api/route-helpers';
import { checkAuth } from '@/lib/auth/require-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" - return null if not found
      return errorResponse(error.message);
    }

    return successResponse(data || null);
  } catch (error) {
    return handleError(error, 'Failed to fetch site settings');
  }
}

export async function PUT(request: Request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const body = await request.json();
    const {
      websiteName,
      websiteDescription,
      iconUrl,
      altIconUrl,
      siteUrl,
      authorName,
      shortName,
      themeColor,
      backgroundColor,
    } = body;

    // Validate required fields
    if (
      !websiteName ||
      !websiteDescription ||
      !iconUrl ||
      !siteUrl ||
      !authorName ||
      !shortName ||
      !themeColor ||
      !backgroundColor
    ) {
      return errorResponse('Missing required fields');
    }

    // Check if a row exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing row
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          website_name: websiteName,
          website_description: websiteDescription,
          icon_url: iconUrl,
          alt_icon_url: altIconUrl || null,
          site_url: siteUrl,
          author_name: authorName,
          short_name: shortName,
          theme_color: themeColor,
          background_color: backgroundColor,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message);
      }

      result = data;
    } else {
      // Insert new row
      const { data, error } = await supabase
        .from('site_settings')
        .insert({
          website_name: websiteName,
          website_description: websiteDescription,
          icon_url: iconUrl,
          alt_icon_url: altIconUrl || null,
          site_url: siteUrl,
          author_name: authorName,
          short_name: shortName,
          theme_color: themeColor,
          background_color: backgroundColor,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(error.message);
      }

      result = data;
    }

    return successResponse(result);
  } catch (error) {
    return handleError(error, 'Failed to update site settings');
  }
}

