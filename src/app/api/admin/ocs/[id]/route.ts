import { createAdminClient } from '@/lib/supabase/server';
import { validateRequiredFields, errorResponse, successResponse, handleError } from '@/lib/api/route-helpers';
import { checkAuth } from '@/lib/auth/require-auth';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Use admin client to bypass RLS for admin operations
    const supabase = createAdminClient();
    const { id } = await params;

    if (!id) {
      return errorResponse('OC ID is required');
    }

    const body = await request.json();

    // Validate required fields
    const validationError = validateRequiredFields(body, ['name', 'slug', 'world_id']);
    if (validationError) {
      return validationError;
    }

    // Validate story_alias_id if provided (and not null/empty)
    if (body.story_alias_id && body.story_alias_id !== '' && body.story_alias_id !== null) {
      const { data: storyAlias, error: aliasError } = await supabase
        .from('story_aliases')
        .select('id, world_id')
        .eq('id', body.story_alias_id)
        .single();

      if (aliasError || !storyAlias) {
        return errorResponse('Invalid story_alias_id provided');
      }

      if (storyAlias.world_id !== body.world_id) {
        return errorResponse('Story alias must belong to the same world as the OC');
      }
    }

    // Normalize story_alias_id: convert empty string to null
    if (body.story_alias_id === '') {
      body.story_alias_id = null;
    }

    // Remove any fields that shouldn't be updated (like nested relationships)
    const {
      world,
      story_alias,
      identity,
      ...updateData
    } = body;

    // First, verify the OC exists
    const { data: existingOC, error: checkError } = await supabase
      .from('ocs')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingOC) {
      logger.error('OC', 'OC not found or access denied', checkError);
      return errorResponse('OC not found', 404);
    }

    // Log what we're about to update
    logger.debug('OC', `Updating OC ${id}`, { keys: Object.keys(updateData) });

    // Perform the update and check affected rows
    const { data: updateResult, error: updateError } = await supabase
      .from('ocs')
      .update(updateData)
      .eq('id', id)
      .select('id');

    if (updateError) {
      logger.error('OC', 'Update error', updateError);
      return errorResponse(updateError.message || 'Failed to update OC');
    }

    // Check if any rows were actually updated
    if (!updateResult || updateResult.length === 0) {
      logger.error('OC', 'No rows were updated', { updateResult });
      return errorResponse('No rows were updated. The OC may not exist or the data may be invalid.');
    }

    logger.success('OC', `Update successful for OC ${id}`);

    // Verify the update by fetching the updated row immediately
    const { data: verifyData, error: verifyError } = await supabase
      .from('ocs')
      .select('*')
      .eq('id', id)
      .single();

    if (verifyError) {
      console.error('Verify error after update:', verifyError);
      return errorResponse('Failed to verify update: ' + verifyError.message);
    }

    if (!verifyData) {
      return errorResponse('OC not found after update', 404);
    }

    // Log a sample of updated fields to verify
    console.log('Verified update - sample fields:', {
      name: verifyData.name,
      first_name: verifyData.first_name,
      last_name: verifyData.last_name,
      species: verifyData.species,
      age: verifyData.age,
    });

    // Fetch the updated OC with relationships
    const { data, error: selectError } = await supabase
      .from('ocs')
      .select(`
        *,
        world:worlds(*),
        story_alias:story_aliases(id, name, slug, description),
        identity:oc_identities(
          *,
          versions:ocs(
            id,
            name,
            slug,
            world_id,
            world:worlds(id, name, slug)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (selectError) {
      logger.error('OC', 'Select error', selectError);
      // Return the basic data we verified
      return successResponse(verifyData);
    }

    if (!data) {
      // Fallback to verified data
      return successResponse(verifyData);
    }

    return successResponse(data);
  } catch (error) {
    return handleError(error, 'Failed to update OC');
  }
}
