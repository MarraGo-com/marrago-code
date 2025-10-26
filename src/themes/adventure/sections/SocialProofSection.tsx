// /src/themes/adventure/sections/SocialProofSection.tsx (UPDATED)
'use client';

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
// REMOVED: useTranslations is no longer needed
// import { useTranslations } from 'next-intl';

// NEW: Import client data and locale hook
import { useLocale } from 'next-intl';

import { siteConfig } from '@/config/client-data';
import Image from 'next/image';

const partnerLogos = [
  { name: 'Award Winner', url: '/images/logo-award.svg' },
  { name: 'Expert Guide', url: '/images/logo-guide.svg' },
  { name: 'As Featured In', url: '/images/logo-magazine.svg' },
  { name: 'Official Partner', url: '/images/logo-partner.svg' },
];

export default function SocialProofSection() {
  // REMOVED: const t = useTranslations('SocialProof');

  // NEW: Get content dynamically based on the current locale
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            mb: 6,
          }}
        >
          {/* UPDATED: Using title from client data */}
          {content.socialProofTitle}
        </Typography>
        
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {partnerLogos.map((logo) => (
            <Grid size={{ xs: 6, sm: 3 }} key={logo.name} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 150,
                  height: 80,
                  mx: 'auto',
                  filter: (theme) =>
                    theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'grayscale(100%) opacity(0.7)',
                  transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out',
                  '&:hover': {
                    filter: 'none',
                    opacity: 1,
                  },
                }}
              >
                <Image
                  src={logo.url}
                  alt={`${logo.name} - ${siteConfig.siteName}`}
                  fill
                  loading='lazy'
                  style={{
                    objectFit: 'contain',
                  }}
                  sizes="150px"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}