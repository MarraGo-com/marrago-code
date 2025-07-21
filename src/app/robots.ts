// -------------------------------------------------------------------------
// 1. NEW FILE: /src/app/robots.ts
// This file will generate the robots.txt file for your site.
// -------------------------------------------------------------------------
import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tourism-agency-snowy.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // We don't want Google to index the admin panel
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}