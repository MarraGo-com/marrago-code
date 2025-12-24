// src/app/[locale]/planning/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/client-data';
import { generateStaticPageMetadata } from '@/lib/metadata';
import TripWizard from '@/components/sections/TripWizard';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { WebsiteLanguage } from '@/config/types';

// Define the params type correctly for Next.js 15+ (async params)
type MetadataParams = Promise<{ locale: WebsiteLanguage }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  // 1. Check if the booking engine/planning feature is enabled
  if (!siteConfig.hasBookingEngine) {
    return generateStaticPageMetadata({
      title: "Page Not Found",
      description: "This feature is currently disabled.",
      images: [],
      pathname: `/planning`,
      url: process.env.NEXT_PUBLIC_API_URL || "https://marrago.com",
    });
  }

  // 2. Fetch the metadata specifically for 'planning'
  const metadata = getStaticPageMetadata('planning', locale); 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://marrago.com",
  });
}

export default async function PlanningPage() {
  
  // 3. Ensure the feature is actually enabled before rendering
  if (!siteConfig.hasBookingEngine) {
    notFound(); 
  }

  return (
    <main>
      <TripWizard />
    </main>
  );
}