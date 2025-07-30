import ExtendedMetadata from "@/interfaces/ExtentedMetadata";
import { ARCHIVES, BOOKMARKS, CATEGORY, FORMAT_DETECTION, ICONS, ITUNES, OTHER } from "@/config/metadata";
import { AUTHORS } from "@/config/metadata/authors";
import { APP_LINKS, MEDIA, ROBOTS, VERIFICATION } from "@/config/metadata/robots";
import { APP_NAME, CREATOR, TWITTER_CREATOR_ID, DEFAULT_LOCALE, GENERATOR, PLATEFORM, PUBLISHER, TWITTER_SITE_ID } from "../config/config";
import { keywords } from "@/config/keywords";

// --- TYPE DEFINITIONS ---

/** Represents a standard image object for SEO purposes. */
type SeoImage = {
  src: string; // Should be a relative path from the base URL
  alt: string;
};

/** Defines the required options for generating page metadata. */
type MetadataOptions = {
  title: string;
  description:string;
  images: SeoImage[];
  pathname: string;
  url: string; // Mandatory website URL for the page, used in Open Graph and Twitter metadata.
  locale?: string;
};

// --- INTERNAL IMPLEMENTATION ---

/**
 * @internal
 * Constructs the full metadata object. This is a base function not meant for direct use.
 */
function _generateBaseMetadata({
  title,
  description,
  pathname,
  url,
  images,
  locale = DEFAULT_LOCALE,
}: MetadataOptions): ExtendedMetadata {
  
  // --- THIS IS THE KEY FIX ---
  // We now construct the full, correct canonical URL by combining the base URL,
  // the current locale, and the page's specific pathname.
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
    // Core Metadata
    title,
    description,
    applicationName: APP_NAME,
    generator: GENERATOR,
    creator: CREATOR,
    publisher: PUBLISHER,
    referrer: 'origin-when-cross-origin',
    keywords,
    authors: AUTHORS,
    manifest: new URL('/manifest.webmanifest', url).toString(),
    category: CATEGORY,

    // Social & Rich Previews
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      images: imageObjects.map(img => ({ ...img, width: 1200, height: 630 })),
      locale,
      type: "website",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      siteId: TWITTER_SITE_ID,
      creator: CREATOR,
      creatorId: TWITTER_CREATOR_ID,
      images: imageObjects,
      app: {
        name: 'Google Play',
        id: {
          googleplay: 'com.newsoftroid.market',
        },
        url: {
          googleplay: 'https://play.google.com/store/apps/details?id=com.newsoftroid.market',
        },
      },
    },

    // URLs & Linking
    alternates: {
      canonical: canonicalUrl,
    },
    appLinks: APP_LINKS,

    // Icons & Appearance
    icons: ICONS,
    appleWebApp: {
      title: PLATEFORM || APP_NAME,
      statusBarStyle: 'black-translucent',
      startupImage: MEDIA['only screen and (max-width: 600px)'] ? [MEDIA['only screen and (max-width: 600px)']]  : [],
    },

    // Verification & Robots
    verification: VERIFICATION,
    robots: ROBOTS,
    
    // Other Metadata
    itunes: ITUNES,
    archives: ARCHIVES,
    bookmarks: BOOKMARKS,
    formatDetection: FORMAT_DETECTION,
    other: OTHER,
  };
}

// --- PUBLIC API ---

export function generateStaticPageMetadata(options: MetadataOptions): ExtendedMetadata {
  return _generateBaseMetadata(options);
}

export function generateDynamicPageMetadata(options: MetadataOptions): ExtendedMetadata {
  return _generateBaseMetadata(options);
}
