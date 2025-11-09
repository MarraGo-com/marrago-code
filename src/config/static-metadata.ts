/**
 * @file lib/static-metadata.ts
 * This file centralizes all metadata (title, description, OG image, pathname)
 * for static pages.
 */

// Correct import: siteConfig and pageSeoMetadataStore now come from client-data.ts
import { siteConfig, pageSeoMetadataStore } from "@/config/client-data";
// Import the MetadataStore interface from page-seo-metadata.ts, not the actual store
import { MetadataStore } from "@/config/page-seo-metadata";
// Import Locale from your central types file
import { Locale } from '@/config/types';


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

// Correctly infer StaticPageKey from the keys of pageSeoMetadataStore
export type StaticPageKey = keyof MetadataStore; // Use MetadataStore from config


const pathStore: Partial<Record<StaticPageKey, string>> = {
  homepage: '/',
  about: '/about',
  contact: '/contact',
  experiences: '/experiences',
  blog: '/blog',
  privacyPolicy: '/privacy-policy', // Added new legal pages
  termsOfUse: '/terms-of-use',     // Added new legal pages
  reviews: '/reviews',             // Assuming this will be a page
  faq: '/faq'                      // Assuming this will be a page
};

/**
 * Retrieves the complete, structured metadata for a given static page and locale.
 */
export function getStaticPageMetadata(
  pageKey: StaticPageKey,
  locale: Locale
): PageMetadata {
  // Use pageSeoMetadataStore instead of the old metadataStore
  // Add robust checks for existence before accessing properties
  const pageTranslations = pageSeoMetadataStore[pageKey];

  // Provide robust fallbacks if pageKey or locale doesn't exist in pageSeoMetadataStore
  const fallbackContent = pageSeoMetadataStore.homepage?.en || {
    title: `${siteConfig.brandName}`,
    description: siteConfig.siteDescription,
    ogImage: siteConfig.ogImage || { src: '/images/og/og-default.webp', alt: 'Default OG Image' }
  };
  
  const content = pageTranslations?.[locale] || pageTranslations?.en || fallbackContent;
  
  const pathname = pathStore[pageKey] || '/';

  // Ensure title is a string before attempting concatenation
  const baseTitle = typeof content?.title === 'string' ? content.title : '';

  // const finalTitle = baseTitle;

  // If the page is 'homepage', use the theme-specific image from siteConfig,
  // otherwise use the specific image defined in pageSeoMetadataStore for that page,
  // falling back to siteConfig's default or a general default.
  const finalOgImage = pageKey === 'homepage' && siteConfig.ogImage
    ? siteConfig.ogImage
    : content?.ogImage || siteConfig.ogImage || { src: '/images/og/og-default.webp', alt: 'Default OG Image' };

  return {
    title: baseTitle,
    description: content?.description || siteConfig.siteDescription || '', // Fallback to siteConfig description
    ogImage: finalOgImage,
    pathname: pathname
  };
}