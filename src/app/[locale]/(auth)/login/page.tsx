// src/app/[locale]/login/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { Container, Box } from '@mui/material';

// --- METADATA IMPORTS ---
import { generateStaticPageMetadata } from '@/lib/metadata';
import ClientLoginForm from '@/components/auth/ClientLoginForm';
import { getStaticPageMetadata } from '@/config/static-metadata';

// Define params type for Next.js 15+
type MetadataParams = Promise<{ locale: 'en' | 'fr' | 'ar' | 'es' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  // Fetch the metadata specifically for 'login'
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
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="sm">
         <Box sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: 'background.paper', boxShadow: 1 }}>
            <ClientLoginForm />
         </Box>
      </Container>
    </Box>
  );
}