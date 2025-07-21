// /src/components/sections/SocialProofSection.tsx
'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
// --- 1. Import next/image ---
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
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            mb: 4,
          }}
        >
          {t('title')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 5, sm: 8 },
          }}
        >
          {partnerLogos.map((logo) => (
            // --- 2. Create a styled wrapper Box ---
            <Box
              key={logo.name}
              sx={{
                position: 'relative', // Required for the 'fill' prop on next/image
                width: { xs: 120, sm: 150 },
                height: { xs: 60, sm: 80 },
                // --- 3. Apply all dynamic styles to the wrapper ---
                filter: (theme) =>
                  theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
                opacity: 0.7,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  opacity: 1,
                  filter: 'none',
                },
              }}
            >
              {/* --- 4. Place the next/image component inside --- */}
              <Image
                src={logo.url}
                alt={`${logo.name} - ${siteConfig.siteName}`}
                fill
                style={{
                  objectFit: 'contain', // Ensures the logo fits without being cropped or stretched
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}