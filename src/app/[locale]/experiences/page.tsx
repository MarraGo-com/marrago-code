// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/experiences/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';
import ExperiencesComponent from '@/components/experience/ExperiencesClient';

// --- DYNAMICALLY IMPORT THE CORRECT LAYOUT COMPONENT ---
// const theme = process.env.NEXT_PUBLIC_THEME || 'default';
// This will now load either your default layout or your new luxury one
// const ExperiencesPageLayout = dynamic(() => import(`@/themes/${theme}/experiences/ExperiencesPageLayout`));
// --- 2. This is the new, cleaner metadata function ---
type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  // We simply call our helper with the page key and the current locale.
  const { locale } = await params;
  const metadata = getStaticPageMetadata('experiences', locale);
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com", // Ensure you have this environment variable set

  });
}
  

export default function ExperiencesPage() {
 
  return (
    <>
      <ExperiencesComponent/>
    </>
  );
}