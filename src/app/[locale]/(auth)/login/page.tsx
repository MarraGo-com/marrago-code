// src/app/[locale]/login/page.tsx
import React from 'react';
import { Metadata } from 'next';
import ClientLoginForm from '@/components/auth/ClientLoginForm';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { WebsiteLanguage } from '@/config/types';

// Define params type for Next.js 15+
type MetadataParams = Promise<{ locale: WebsiteLanguage}>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = getStaticPageMetadata('login', locale); 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://marrago.com",
  });
}

export default function LoginPage() {
  // REMOVED: Container, Box wrapper, Shadows, Background Colors.
  // The AuthLayout already handles the positioning and dark background.
  return <ClientLoginForm />;
}