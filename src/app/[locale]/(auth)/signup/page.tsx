// src/app/[locale]/signup/page.tsx
import React from 'react';
import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm'; // Import the client component
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { WebsiteLanguage } from '@/config/types';

type MetadataParams = Promise<{ locale: WebsiteLanguage }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = getStaticPageMetadata('signup', locale); 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://marrago.com",
  });
}

export default function SignupPage() {
  // REMOVED: Container, Box, Shadow, Bgcolor.
  // The layout handles the "frame" now.
  return <SignupForm />;
}