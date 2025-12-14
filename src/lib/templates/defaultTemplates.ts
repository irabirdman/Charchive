import type { TemplateDefinition } from './ocTemplates';

/**
 * Minimal default fallback template - only used when no templates are found in the database.
 * All actual template definitions should be stored in worlds.oc_templates.
 */
export const defaultFallbackTemplate: TemplateDefinition = {
  name: 'None',
  fields: [],
};

