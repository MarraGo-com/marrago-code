// src/lib/metadata.ts
import ExtendedMetadata from "@/interfaces/ExtentedMetadata";
// --- KEPT: These are your static template configs ---
import { ARCHIVES, BOOKMARKS, FORMAT_DETECTION, ICONS, ITUNES, OTHER } from "@/config/metadata";
import { APP_LINKS, MEDIA, ROBOTS, VERIFICATION } from "@/config/metadata/robots";

// --- DELETED: These old, hard-coded files are no longer needed ---
// import { AUTHORS } from "@/config/metadata/authors";
// import { APP_NAME, CREATOR, ... } from "../config/config";

// --- KEPT: This is your new, dynamic config ---
import { siteConfig } from '@/config/client-data';
import { WebsiteLanguage } from "@/config/types";

// --- TYPE DEFINITIONS (No changes) ---
type SeoImage = {
  src: string;
  alt: string;
};
type MetadataOptions = {
  title: string;
  description:string;
  images: SeoImage[];
  pathname: string;
  url: string;
  locale?: string;
};

// --- INTERNAL IMPLEMENTATION ---
function _generateBaseMetadata({
  title,
  description,
  pathname,
  url,
  images,
  // UPDATED: Default locale now comes from your dynamic siteConfig
  locale = siteConfig.websiteLanguageOptions[0] || 'en',
}: MetadataOptions): ExtendedMetadata {
  
  const canonicalUrl = new URL(`${locale}${pathname}`, url).toString();

  const imageObjects = images.map(({ src, alt }) => {
    const absoluteSrc = new URL(src, url).toString();
    return {
      url: absoluteSrc,
      secureUrl: absoluteSrc,
      alt,
    };
  });

  return {
    // --- Core Metadata (UPDATED to pull from siteConfig) ---
    title,
    description,
    applicationName: siteConfig.siteName, // <-- UPDATED
    generator: "Upmerce.com", // <-- This can be static
    creator: siteConfig.ownerName, // <-- UPDATED
    publisher: siteConfig.brandName, // <-- UPDATED
    referrer: 'origin-when-cross-origin',
    keywords: ( // <-- This is your fix, it is correct
      siteConfig.textContent[locale as WebsiteLanguage]?.global?.keywords ||
      siteConfig.textContent.en.global.keywords
    ).split(',').map(k => k.trim()),
    authors: [{ name: siteConfig.ownerName, url: url }], // <-- UPDATED
    manifest: new URL('/manifest.webmanifest', url).toString(),
    category: siteConfig.businessType, // <-- UPDATED

    // --- Social & Rich Previews (UPDATED) ---
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.siteName, // <-- UPDATED
      images: imageObjects.map(img => ({ ...img, width: 1200, height: 630 })),
      locale,
      type: "website",
    },

    // --- Twitter (UPDATED to match your ExtendedMetadata.ts type) ---
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // We are now using the dynamic, specific values from siteConfig
      siteId: siteConfig.social.twitterSiteId || '', // <-- UPDATED
      creator: siteConfig.social.twitterHandle || '', // <-- UPDATED
      creatorId: siteConfig.social.twitterCreatorId || '', // <-- UPDATED
      images: imageObjects,
      app: { // This is fine as part of your template
        name: 'Google Play',
        id: { googleplay: 'com.newsoftroid.market' },
        url: { googleplay: 'https://play.google.com/store/apps/details?id=com.newsoftroid.market' },
      },
    },

    // --- URLs & Linking (KEPT your template config) ---
    alternates: {
      canonical: canonicalUrl,
    },
    appLinks: APP_LINKS,

    // --- Icons & Appearance (KEPT your template config) ---
    icons: ICONS,
    appleWebApp: {
      title: siteConfig.siteName, // <-- UPDATED
      statusBarStyle: 'black-translucent',
      startupImage: MEDIA['only screen and (max-width: 600px)'] ? [MEDIA['only screen and (max-width: 600px)']]  : [],
    },

    // --- Verification & Robots (KEPT your template config) ---
    verification: VERIFICATION,
    robots: ROBOTS,
    
    // --- Other Metadata (KEPT your template config) ---
    itunes: ITUNES,
    archives: ARCHIVES,
    bookmarks: BOOKMARKS,
    formatDetection: FORMAT_DETECTION,
    other: OTHER,
  };
}

// --- PUBLIC API (No changes) ---

export function generateStaticPageMetadata(options: MetadataOptions): ExtendedMetadata {
  return _generateBaseMetadata(options);
}

export function generateDynamicPageMetadata(options: MetadataOptions): ExtendedMetadata {
  return _generateBaseMetadata(options);
}