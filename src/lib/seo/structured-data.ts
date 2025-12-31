/**
 * Structured data (JSON-LD) helpers for SEO
 */

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url?: string;
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: PersonSchema;
  publisher?: OrganizationSchema;
}

export interface ProfilePageSchema {
  '@context': 'https://schema.org';
  '@type': 'ProfilePage';
  name: string;
  description?: string;
  image?: string | string[];
  mainEntity?: {
    '@type': 'Person';
    name: string;
    image?: string;
  };
}

export interface WebPageSchema {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  image?: string | string[];
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(
  name: string,
  url: string,
  options: {
    logo?: string;
    description?: string;
    sameAs?: string[];
  } = {}
): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(options.logo && { logo: options.logo }),
    ...(options.description && { description: options.description }),
    ...(options.sameAs && options.sameAs.length > 0 && { sameAs: options.sameAs }),
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema(
  name: string,
  url: string,
  options: {
    description?: string;
    searchUrlTemplate?: string;
  } = {}
): WebSiteSchema {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(options.description && { description: options.description }),
  };

  if (options.searchUrlTemplate) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: options.searchUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * Generate Person schema
 */
export function generatePersonSchema(
  name: string,
  options: {
    url?: string;
  } = {}
): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(options.url && { url: options.url }),
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(
  headline: string,
  options: {
    description?: string;
    image?: string | string[];
    datePublished?: string;
    dateModified?: string;
    author?: PersonSchema;
    publisher?: OrganizationSchema;
  } = {}
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(options.description && { description: options.description }),
    ...(options.image && { image: options.image }),
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.author && { author: options.author }),
    ...(options.publisher && { publisher: options.publisher }),
  };
}

/**
 * Generate ProfilePage schema
 */
export function generateProfilePageSchema(
  name: string,
  options: {
    description?: string;
    image?: string | string[];
    mainEntityName?: string;
    mainEntityImage?: string;
  } = {}
): ProfilePageSchema {
  const schema: ProfilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name,
    ...(options.description && { description: options.description }),
    ...(options.image && { image: options.image }),
  };

  if (options.mainEntityName) {
    schema.mainEntity = {
      '@type': 'Person',
      name: options.mainEntityName,
      ...(options.mainEntityImage && { image: options.mainEntityImage }),
    };
  }

  return schema;
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema(
  name: string,
  url: string,
  options: {
    description?: string;
    image?: string | string[];
  } = {}
): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    ...(options.description && { description: options.description }),
    ...(options.image && { image: options.image }),
  };
}

