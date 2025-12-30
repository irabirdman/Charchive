import { Metadata } from 'next';
import { getSiteConfig } from './site-config';

export async function generatePageMetadata(
  title: string,
  description: string,
  path: string = '/'
): Promise<Metadata> {
  const config = await getSiteConfig();
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const iconUrl = config.iconUrl || '/images/logo.png';
  const fullTitle = `${title} | ${config.websiteName}`;
  
  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: 'website',
      siteName: config.websiteName,
      images: [
        {
          url: `${siteUrl}${iconUrl}`,
          width: 512,
          height: 512,
          alt: `${config.websiteName} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${siteUrl}${iconUrl}`],
    },
    alternates: {
      canonical: path,
    },
  };
}

