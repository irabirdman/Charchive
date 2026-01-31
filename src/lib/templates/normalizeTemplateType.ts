import type { TemplateType } from '@/types/oc';

const VALID_TEMPLATE_TYPES: TemplateType[] = [
  'naruto',
  'ff7',
  'inuyasha',
  'shaman-king',
  'zelda',
  'dragonball',
  'pokemon',
  'nier',
  'original',
  'none',
];

/**
 * Normalize template_type values when they are known variations.
 * Maps variations like 'naruto-universe' to 'naruto' by checking prefixes.
 * Unknown values (e.g. template keys added from the database) are returned as-is
 * so DB-originated template keys are preserved.
 */
export function normalizeTemplateType(value: string | null | undefined): TemplateType | string {
  if (value == null || value === '') {
    return 'none';
  }

  const trimmed = value.trim();
  if (!trimmed) return 'none';

  if (VALID_TEMPLATE_TYPES.includes(trimmed as TemplateType)) {
    return trimmed as TemplateType;
  }

  const lower = trimmed.toLowerCase();

  if (lower.startsWith('naruto')) return 'naruto';
  if (lower.startsWith('ff7') || (lower.includes('final') && lower.includes('fantasy') && lower.includes('7'))) return 'ff7';
  if (lower.startsWith('inuyasha')) return 'inuyasha';
  if (lower.startsWith('shaman') && lower.includes('king')) return 'shaman-king';
  if (lower.startsWith('zelda') || (lower.includes('legend') && lower.includes('zelda'))) return 'zelda';
  if (lower.startsWith('dragonball') || (lower.includes('dragon') && lower.includes('ball'))) return 'dragonball';
  if (lower.startsWith('pokemon') || lower.startsWith('pokémon')) return 'pokemon';
  if (lower.startsWith('nier')) return 'nier';
  if (lower.startsWith('original')) return 'original';

  // Preserve template keys that come from the database (e.g. world.oc_templates keys)
  return trimmed;
}
