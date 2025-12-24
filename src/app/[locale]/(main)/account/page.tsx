// src/app/[locale]/account/page.tsx
import React from 'react';
import { Metadata } from 'next';
import AccountView from '@/components/account/AccountView'; // Import the client component

// --- METADATA IMPORTS ---
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { WebsiteLanguage } from '@/config/types';

// Define params type for Next.js 15+
type MetadataParams = Promise<{ locale: WebsiteLanguage }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  // Fetch the metadata specifically for 'account'
  const metadata = getStaticPageMetadata('account', locale); 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://marrago.com",
  });
}

export default function AccountPage() {
  return (
    <main>
       <AccountView />
    </main>
  );
}