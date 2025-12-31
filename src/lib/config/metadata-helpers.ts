import { Metadata } from 'next';
import { generatePageMetadata as generateEnhancedPageMetadata } from '@/lib/seo/page-metadata';

/**
 * Legacy wrapper for generatePageMetadata
 * @deprecated Use generatePageMetadata from @/lib/seo/page-metadata instead
 */
export async function generatePageMetadata(
  title: string,
  description: string,
  path: string = '/'
): Promise<Metadata> {
  return generateEnhancedPageMetadata({
    title,
    description,
    path,
  });
}

