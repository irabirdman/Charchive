/**
 * Font Awesome icon mappings for form sections
 * Icons are semantic and decorative, placed before section titles
 */

export type SectionIconName =
  | 'core-identity'
  | 'visual-identity'
  | 'basic-information'
  | 'appearance'
  | 'relationships'
  | 'personality-traits'
  | 'content'
  | 'metadata'
  | 'settings'
  | 'timeline'
  | 'lore'
  | 'location'
  | 'modular-fields'
  | 'overview'
  | 'society-culture'
  | 'world-building'
  | 'economy-systems'
  | 'additional-information'
  | 'media-preferences';

/**
 * Maps section names to Font Awesome icon class names
 */
export const sectionIcons: Record<SectionIconName, string> = {
  'core-identity': 'fa-id-card',
  'visual-identity': 'fa-palette',
  'basic-information': 'fa-info-circle',
  appearance: 'fa-eye',
  relationships: 'fa-users',
  'personality-traits': 'fa-brain',
  content: 'fa-book',
  metadata: 'fa-tags',
  settings: 'fa-cog',
  timeline: 'fa-clock',
  lore: 'fa-scroll',
  location: 'fa-map-marker-alt',
  'modular-fields': 'fa-list-ul',
  overview: 'fa-file-alt',
  'society-culture': 'fa-globe',
  'world-building': 'fa-cube',
  'economy-systems': 'fa-coins',
  'additional-information': 'fa-plus-circle',
  'media-preferences': 'fa-music',
};

/**
 * Get icon class name for a section
 * Falls back to a default icon if section name not found
 */
export function getSectionIcon(sectionName: SectionIconName | string): string {
  if (sectionName in sectionIcons) {
    return sectionIcons[sectionName as SectionIconName];
  }
  // Default fallback icon
  return 'fa-folder';
}

/**
 * Get all available section icon names
 */
export function getAvailableSectionIcons(): SectionIconName[] {
  return Object.keys(sectionIcons) as SectionIconName[];
}

