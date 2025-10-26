// /src/themes/default/sections/SocialProofSection.tsx (UPDATED)
'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
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
          {/* UPDATED: Using title from client data */}
          {content.socialProofTitle}
        </Typography>
        
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: 'fit-content',
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
              animation: 'scroll 30s linear infinite',
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <Box
                key={`${logo.name}-${index}`}
                sx={{
                  position: 'relative',
                  width: { xs: 120, sm: 150 },
                  height: { xs: 60, sm: 80 },
                  mx: { xs: 2, sm: 4 },
                  flexShrink: 0,
                  filter: (theme) =>
                    theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
                  opacity: 0.7,
                  transition: 'opacity 0.3s',
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
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}