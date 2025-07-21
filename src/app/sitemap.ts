// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/sitemap.ts
// This file now correctly escapes special characters in image URLs.
// -------------------------------------------------------------------------
import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import { getStaticPageMetadata, StaticPageKey } from '@/config/static-metadata';
import { locales } from '@/i18n/routing';

// Define your supported locales


// --- THIS IS THE KEY FIX ---
// A helper function to escape special XML characters in URLs.
const escapeXml = (url: string) => {
  return url.replace(/&/g, '&amp;');
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tourism-agency-snowy.vercel.app';

  // --- 1. Generate URLs for all static pages for each locale ---
  const staticPageKeys: StaticPageKey[] = ['homepage', 'about', 'contact', 'experiences', 'blog'];
  const staticPages = locales.flatMap((locale) => 
    staticPageKeys.map(key => {
      const metadata = getStaticPageMetadata(key, locale as 'en' | 'fr');
      return {
        url: `${siteUrl}/${locale}${metadata.pathname === '/' ? '' : metadata.pathname}`,
        lastModified: new Date(),
        images: [escapeXml(`${siteUrl}${metadata.ogImage.src}`)]
      };
    })
  );

  // --- 2. Generate URLs for all published experiences for each locale ---
  const experiencesSnapshot = await adminDb.collection('experiences').get();
  const experienceUrls = experiencesSnapshot.docs.flatMap(doc => {
    const data = doc.data();
    if (!data.coverImage) return []; // Skip if there's no cover image
    return locales.map(locale => ({
      url: `${siteUrl}/${locale}/experiences/${doc.id}`,
      lastModified: data.updatedAt ? data.updatedAt.toDate() : new Date(),
      images: [escapeXml(data.coverImage)]
    }));
  });

  // --- 3. Generate URLs for all published articles for each locale ---
  const articlesSnapshot = await adminDb.collection('articles').where('status', '==', 'published').get();
  const articleUrls = articlesSnapshot.docs.flatMap(doc => {
    const data = doc.data();
    if (!data.coverImage) return []; // Skip if there's no cover image
    return locales.map(locale => ({
      url: `${siteUrl}/${locale}/blog/${data.slug}`,
      lastModified: data.updatedAt ? data.updatedAt.toDate() : new Date(),
      images: [escapeXml(data.coverImage)]
    }));
  });

  return [
    ...staticPages,
    ...experienceUrls,
    ...articleUrls,
  ];
}