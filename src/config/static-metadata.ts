/**
 * @file lib/static-metadata.ts
 * This file centralizes all metadata (title, description, OG image, pathname)
 * for static pages.
 */

import { metadataStore, siteConfig } from '@/config/site';

// --- 1. DEFINE THE NEW SeoImage TYPE ---
export type SeoImage = {
  src: string; // Should be a relative path from the /public folder
  alt: string;
};

// Update the main return type
export type PageMetadata = {
  title: string;
  description: string;
  ogImage: SeoImage;
  pathname: string;
};

export type StaticPageKey = keyof typeof metadataStore;
export type Locale = 'en' | 'fr';

/**
 * The database containing all static metadata.
 * The ogImage property is now a structured object.
 */
/**
 * The database containing all static metadata.
 * The ogImage property is now a structured object for all pages.
 */


const pathStore = {
    homepage: '/',
    about: '/about',
    contact: '/contact',
    experiences: '/experiences',
    blog: '/blog'
} as const;

/**
 * Retrieves the complete, structured metadata for a given static page and locale.
 */
export function getStaticPageMetadata(
  pageKey: StaticPageKey,
  locale: Locale
): PageMetadata {
  const fallback = metadataStore.homepage.en;
  const pageTranslations = metadataStore[pageKey];
  const content = pageTranslations?.[locale] || pageTranslations?.en || fallback;
  const pathname = pathStore[pageKey] || '/';
  
  const finalTitle = pageKey === 'homepage' 
    ? `${siteConfig.siteName} | ${content.title}` 
    : `${content.title} | ${siteConfig.siteName}`;

  return {
    title: finalTitle,
    description: content.description,
    ogImage: content.ogImage,
    pathname: pathname
  };
}