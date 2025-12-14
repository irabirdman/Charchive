import { createClient } from '@/lib/supabase/server';
import { validateRequiredFields, checkSlugUniquenessExcluding, errorResponse, successResponse, handleError } from '@/lib/api/route-helpers';
import { checkAuth } from '@/lib/auth/require-auth';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('story_aliases')
      .select(`
        *,
        world:worlds(id, name, slug, series_type)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Story alias not found', 404);
      }
      return errorResponse(error.message);
    }

    return successResponse(data);
  } catch (error) {
    return handleError(error, 'Failed to fetch story alias');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await params;

    const body = await request.json();
    const {
      name,
      slug,
      description,
    } = body;

    // Validate required fields
    const validationError = validateRequiredFields(body, ['name', 'slug']);
    if (validationError) {
      return validationError;
    }

    // First, verify the story alias exists and get its world_id
    const { data: existingAlias, error: checkError } = await supabase
      .from('story_aliases')
      .select('id, world_id')
      .eq('id', id)
      .single();

    if (checkError || !existingAlias) {
      return errorResponse('Story alias not found', 404);
    }

    // Check if slug is unique per world (excluding current record)
    const existingSlug = await checkSlugUniquenessExcluding(
      supabase,
      'story_aliases',
      slug,
      'world_id',
      existingAlias.world_id,
      id
    );
    if (existingSlug) {
      return errorResponse('A story alias with this slug already exists in this world');
    }

    // Perform the update
    const { error: updateError } = await supabase
      .from('story_aliases')
      .update({
        name,
        slug,
        description: description || null,
      })
      .eq('id', id);

    if (updateError) {
      return errorResponse(updateError.message || 'Failed to update story alias');
    }

    // Fetch the updated story alias
    const { data: updatedAlias, error: fetchError } = await supabase
      .from('story_aliases')
      .select(`
        *,
        world:worlds(id, name, slug, series_type)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      return errorResponse(fetchError.message || 'Failed to fetch updated story alias');
    }

    return successResponse(updatedAlias);
  } catch (error) {
    return handleError(error, 'Failed to update story alias');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await params;

    // Delete story alias (cascade will set related story_alias_id to NULL)
    const { error } = await supabase
      .from('story_aliases')
      .delete()
      .eq('id', id);

    if (error) {
      return errorResponse(error.message || 'Failed to delete story alias');
    }

    return successResponse({ success: true });
  } catch (error) {
    return handleError(error, 'Failed to delete story alias');
  }
}

