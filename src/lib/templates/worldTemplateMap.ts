import type { World, SeriesType } from '@/types/oc';

/**
 * Determine template type from world data
 * 
 * Priority:
 * 1. Use template_type from database (if world has it)
 * 2. If world data provided and series_type is 'original', return 'original'
 * 3. If World has oc_templates with a template keyed by world slug, infer template type
 * 4. Default to 'none'
 * 
 * Note: template_type should be stored in the database in worlds.template_type column.
 * This function now prioritizes the database value over hardcoded mappings.
 */
export function getTemplateTypeFromWorldSlug(
  slug: string, 
  world?: World | Partial<World> | { series_type?: SeriesType; template_type?: string; oc_templates?: World['oc_templates'] } | null
): string {
  const slugLower = slug.toLowerCase();

  // Priority 1: Use template_type from database if available
  if (world && 'template_type' in world && world.template_type) {
    return world.template_type;
  }

  // Priority 2: If world data provided and series_type is 'original', return 'original'
  if (world?.series_type === 'original') {
    return 'original';
  }

  // Priority 3: If world has oc_templates, check if there's a template keyed by the world slug
  // This allows worlds to have custom templates that use their slug as the template type
  if (world?.oc_templates && typeof world.oc_templates === 'object') {
    const worldTemplates = world.oc_templates;
    
    // Check if there's a template using the world slug as the key
    if (worldTemplates[slugLower]) {
      // If the world has a custom template with its slug, use the slug as template type
      return slugLower;
    }
  }

  // Priority 4: Default to 'none' for unknown worlds
  // Note: If template_type is not set in the database, it should be set via migration or admin UI
  return 'none';
}
