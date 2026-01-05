import { createAdminClient } from '@/lib/supabase/server';
import { validateRequiredFields, checkSlugUniqueness, errorResponse, successResponse, handleError } from '@/lib/api/route-helpers';
import { checkAuth } from '@/lib/auth/require-auth';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const body = await request.json();

    // Validate required fields
    const validationError = validateRequiredFields(body, ['name', 'slug']);
    if (validationError) {
      logger.error('OC', 'Validation error', { validationError });
      return validationError;
    }

    // Normalize world_id: convert empty string to null
    if (body.world_id === '' || body.world_id === null) {
      body.world_id = null;
    }

    // Check if slug is unique per world (or globally if world_id is null)
    if (body.world_id) {
      const existingOC = await checkSlugUniqueness(supabase, 'ocs', body.slug, 'world_id', body.world_id);
      if (existingOC) {
        return errorResponse(`A character with slug "${body.slug}" already exists in this world.`);
      }
    } else {
      // If world_id is null, check uniqueness globally among OCs with null world_id
      const { data: existingOC, error: checkError } = await supabase
        .from('ocs')
        .select('id')
        .eq('slug', body.slug)
        .is('world_id', null)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is what we want
        throw checkError;
      }
      
      if (existingOC) {
        return errorResponse(`A character with slug "${body.slug}" already exists.`);
      }
    }

    // Create identity if not provided (for new OCs)
    let identityId = body.identity_id;
    if (!identityId) {
      // If identity_id is provided, use it (for adding new version)
      // Otherwise, create a new identity
      const { data: newIdentity, error: identityError } = await supabase
        .from('oc_identities')
        .insert({ name: body.name })
        .select('id')
        .single();

      if (identityError) {
        logger.error('OC', 'Error creating identity', { error: identityError });
        return errorResponse('Failed to create identity', 500);
      }

      identityId = newIdentity.id;
    } else {
      // Verify the identity exists
      const { data: existingIdentity, error: identityCheckError } = await supabase
        .from('oc_identities')
        .select('id')
        .eq('id', identityId)
        .single();

      if (identityCheckError || !existingIdentity) {
        return errorResponse('Invalid identity_id provided');
      }
    }

    // Create OC with identity_id
    const { identity_id, ...ocData } = body; // Remove identity_id from body if present

    // Normalize story_alias_id: convert empty string to null
    if (ocData.story_alias_id === '' || ocData.story_alias_id === null) {
      ocData.story_alias_id = null;
    }

    // Validate story_alias_id if provided (and not null) and world_id is set
    if (ocData.story_alias_id && ocData.world_id) {
      const { data: storyAlias, error: aliasError } = await supabase
        .from('story_aliases')
        .select('id, world_id')
        .eq('id', ocData.story_alias_id)
        .single();

      if (aliasError || !storyAlias) {
        return errorResponse('Invalid story_alias_id provided');
      }

      if (storyAlias.world_id !== ocData.world_id) {
        return errorResponse('Story alias must belong to the same world as the OC');
      }
    }

    // Try multiple approaches for story_aliases relationship to work in both environments
    let data: any = null;
    let error: any = null;

    // Try 1: Explicit FK syntax
    let result = await supabase
      .from('ocs')
      .insert({ ...ocData, identity_id: identityId })
      .select(`
        *,
        world:worlds(*),
        story_alias:story_aliases!fk_ocs_story_alias_id(id, name, slug, description),
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
      .single();

    data = result.data;
    error = result.error;

    // If PGRST200 (relationship not found) with explicit FK, try implicit relationship
    if (error && error.code === 'PGRST200' && 
        error.message?.includes('story_aliases') &&
        error.message?.includes('schema cache')) {
      
      // Try 2: Implicit relationship syntax
      result = await supabase
        .from('ocs')
        .insert({ ...ocData, identity_id: identityId })
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
        .single();

      data = result.data;
      error = result.error;
    }

    // If still error, try without story_alias and fetch separately
    if (error && (error.code === 'PGRST200' || error.code === 'PGRST201') && 
        (error.message?.includes('story_aliases') || 
         error.message?.includes('more than one relationship') ||
         error.message?.includes('schema cache'))) {
      
      // Try 3: No relationship, fetch separately
      result = await supabase
        .from('ocs')
        .insert({ ...ocData, identity_id: identityId })
        .select(`
          *,
          world:worlds(*),
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
        .single();

      data = result.data;
      error = result.error;

      // Fetch story_alias separately if we have story_alias_id
      if (data && data.story_alias_id) {
        try {
          const { data: storyAlias } = await supabase
            .from('story_aliases')
            .select('id, name, slug, description')
            .eq('id', data.story_alias_id)
            .single();
          
          if (storyAlias) {
            data.story_alias = storyAlias;
          }
        } catch (err) {
          // Silently fail - story_alias is optional
        }
      }
    }

    if (error) {
      logger.error('OC', 'Supabase error creating OC', { error });
      return errorResponse(error.message || 'Failed to create OC');
    }

    if (!data) {
      logger.error('OC', 'No data returned after creating OC');
      return errorResponse('Failed to create OC', 500);
    }

    logger.success('OC', `Successfully created OC: ${data.name}`, { ocId: data.id });
    return successResponse(data);
  } catch (error) {
    return handleError(error, 'Failed to create OC');
  }
}
