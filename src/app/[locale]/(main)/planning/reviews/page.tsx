// src/app/[locale]/reviews/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/client-data';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';
import dynamic from 'next/dynamic';
import { getComponentImport } from '@/lib/theme-component-loader';
import { getAllApprovedReviews } from '@/lib/data'; // <-- Import new data function
import { Review } from '@/types/review'; // <-- Import new type

// --- Define the props for our layout component ---
// This ensures all theme layouts expect the 'reviews' prop
export interface ReviewsPageLayoutProps {
  reviews: Review[];
}

// --- Define the dynamic ReviewsPageLayout ---
// It now expects ReviewsPageLayoutProps
const ReviewsPageLayout = dynamic<ReviewsPageLayoutProps>(
  getComponentImport('ReviewsPageLayout', 'reviews')
);

// --- METADATA (Unchanged) ---
type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  // ... (all your existing metadata logic is correct)
  const { locale } = await params;
  if (!siteConfig.hasReviewsSystem) {
    return generateStaticPageMetadata({
      title: "Not Found",
      description: "The reviews feature is currently disabled.",
      pathname: `/reviews`,
      url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
       images: [],
    });
  }
  const metadata = getStaticPageMetadata('reviews', locale);
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}

// --- PAGE COMPONENT (REFACTORED) ---
export default async function ReviewsPage() {
  if (!siteConfig.hasReviewsSystem) {
    notFound(); 
  }

  // 1. Fetch data on the server
  const reviews = await getAllApprovedReviews();

  // 2. Pass data as a prop to the theme-specific layout
  return (
    <main>
      <ReviewsPageLayout reviews={reviews} />
    </main>
  );
}