export function slugify(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize to decomposed form for better unicode handling
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars (except -)
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
    || 'untitled'; // Fallback if result is empty
}
