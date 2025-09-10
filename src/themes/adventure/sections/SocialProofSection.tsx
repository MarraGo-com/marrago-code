// /src/themes/adventure/sections/SocialProofSection.tsx
'use client';

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import Image from 'next/image';

const partnerLogos = [
  { name: 'Award Winner', url: '/images/logo-award.svg' },
  { name: 'Expert Guide', url: '/images/logo-guide.svg' },
  { name: 'As Featured In', url: '/images/logo-magazine.svg' },
  { name: 'Official Partner', url: '/images/logo-partner.svg' },
];

export default function SocialProofSection() {
  const t = useTranslations('SocialProof');

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
          {t('title')}
        </Typography>
        
        {/* --- THIS IS THE KEY CHANGE --- */}
        {/* We replace the animated scroller with a bold, static Grid */}
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