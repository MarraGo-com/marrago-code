// src/app/[locale]/faq/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/client-data';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

import dynamic from 'next/dynamic'; // <-- 1. Import dynamic
import { getComponentImport } from '@/lib/theme-component-loader'; // <-- 2. Import our loader

// 3. REMOVE unused imports for "Coming Soon"
// import { getTranslations } from 'next-intl/server';
// import { Container, Typography, Box } from '@mui/material';

// 4. Define the dynamic FaqSection
// (Assuming it's a default client component, add .then() if it's a default export)
const FaqSection = dynamic(getComponentImport('FaqSection', 'sections'));

// --- ▲▲▲ CHANGES END HERE ▲▲▲ ---


type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  if (!siteConfig.hasFaqSection) {
    return generateStaticPageMetadata({
      title: "Not Found",
      description: "The FAQ section is currently disabled.",
      images: [],
      pathname: `/faq`,
      url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
    });
  }

  const metadata = getStaticPageMetadata('faq', locale); 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}

export default async function FaqPage() {
  // const t = await getTranslations('FaqPage'); // <-- REMOVED (no longer needed)

  if (!siteConfig.hasFaqSection) {
    notFound(); 
  }

  // 5. Render the dynamic FaqSection instead of the "Coming Soon" message
  return (
    <main>
      <FaqSection />
    </main>
  );

  /*
  // --- OLD "Coming Soon" code ---
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('faqComingSoonTitle') || 'FAQ Coming Soon!'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          {t('faqComingSoonText') || 'We are compiling a list of frequently asked questions to assist you. Please check back soon!'}
        </Typography>
      </Container>
    </Box>
  );
  */
}