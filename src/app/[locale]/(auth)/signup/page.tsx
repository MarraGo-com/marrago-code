// src/app/[locale]/signup/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { Container, Box } from '@mui/material';
import SignupForm from '@/components/auth/SignupForm'; // Import the client component

// --- METADATA IMPORTS ---
import { getStaticPageMetadata } from '@/config/static-metadata';
import { generateStaticPageMetadata } from '@/lib/metadata';

// Define params type for Next.js 15+
type MetadataParams = Promise<{ locale: 'en' | 'fr' | 'ar' | 'es' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  // Fetch the metadata specifically for 'signup'
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
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="sm">
         <Box sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: 'background.paper', boxShadow: 1 }}>
            <SignupForm />
         </Box>
      </Container>
    </Box>
  );
}