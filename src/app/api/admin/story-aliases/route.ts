import { createClient } from '@/lib/supabase/server';
import { validateRequiredFields, checkSlugUniqueness, errorResponse, successResponse, handleError } from '@/lib/api/route-helpers';
import { checkAuth } from '@/lib/auth/require-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const worldId = searchParams.get('world_id');

    // Build query
    let query = supabase
      .from('story_aliases')
      .select(`
        *,
        world:worlds(id, name, slug, series_type)
      `)
      .order('name', { ascending: true });

    // Apply filters
    if (worldId) {
      query = query.eq('world_id', worldId);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(error.message);
    }

    return successResponse(data || []);
  } catch (error) {
    return handleError(error, 'Failed to fetch story aliases');
  }
}

export async function POST(request: Request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const body = await request.json();
    const {
      world_id,
      name,
      slug,
      description,
    } = body;

    // Validate required fields
    const validationError = validateRequiredFields(body, ['world_id', 'name', 'slug']);
    if (validationError) {
      return validationError;
    }

    // Verify world exists and is canon
    const { data: world, error: worldError } = await supabase
      .from('worlds')
      .select('id, series_type')
      .eq('id', world_id)
      .single();

    if (worldError || !world) {
      return errorResponse('World not found', 404);
    }

    if (world.series_type !== 'canon') {
      return errorResponse('Story aliases can only be created for canon worlds', 400);
    }

    // Check if slug is unique per world
    const existingAlias = await checkSlugUniqueness(supabase, 'story_aliases', slug, 'world_id', world_id);
    if (existingAlias) {
      return errorResponse('A story alias with this slug already exists in this world');
    }

    // Insert story alias
    const { data: storyAlias, error: insertError } = await supabase
      .from('story_aliases')
      .insert({
        world_id,
        name,
        slug,
        description: description || null,
      })
      .select(`
        *,
        world:worlds(id, name, slug, series_type)
      `)
      .single();

    if (insertError) {
      return errorResponse(insertError.message);
    }

    return successResponse(storyAlias);
  } catch (error) {
    return handleError(error, 'Failed to create story alias');
  }
}

