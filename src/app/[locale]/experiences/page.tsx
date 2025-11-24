// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/experiences/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';
//import ExperiencesClient from '@/components/experience/ExperiencesClient';
import { siteConfig } from '@/config/client-data';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'; // <-- 1. Import dynamic

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

// 2. Import our server-side loader
import { getComponentImport } from "@/lib/theme-component-loader"; 
//import { ExperiencesPageLayoutProps } from '@/themes/default/experiences/ExperiencesPageLayout';



// 4. Use getComponentImport to load the component
// We are using the 'experiences' subfolder
 const ExperiencesPageLayout = dynamic(getComponentImport('ExperiencesPageLayout', 'experiences'));



type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  if (!siteConfig.hasExperiencesSection) {
    return generateStaticPageMetadata({
      title: "Page Not Found",
      description: "This page is not available.",
      pathname: `/experiences`,
      url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
      images: [],
    });
  }

  const metadata = getStaticPageMetadata('experiences', locale);
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}
  

export default async function ExperiencesPage() { 
  if (!siteConfig.hasExperiencesSection) {
    redirect('/'); 
  }

  // 5. Wrap the client component in the dynamic layout
  return (
    <ExperiencesPageLayout/>
  );
}