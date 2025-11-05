// src/themes/overrides/marrago-client/SocialProofSection.tsx
'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useLocale } from 'next-intl';

import { siteConfig } from '@/config/client-data';
import Image from 'next/image';

// --- CUSTOMIZED FOR MARRAGO ---
// This array is now a strategic "target list" for Omar.
// You will need to get these logos from him (or from their official sites
// with permission) and place them in your /public/images/logos/ folder.
const partnerLogos = [
  { 
    name: 'Moroccan Ministry of Tourism', 
    url: '/images/logos/logo-ministry-tourism.webp' // (Placeholder path)
  },
  { 
    name: 'FNTT - Fédération Nationale du Transport Touristique', // <-- NEW
    url: '/images/logos/logo-fntt-maroc.webp' // (Placeholder path)
  },
  { 
    name: 'TripAdvisor', 
    url: '/images/logos/logo-tripadvisor.webp' // (Placeholder path)
  },
  { 
    name: 'Trusted Hotel Partner', 
    url: '/images/logos/logo-mamounia.webp' // (e.g., A famous Riad's logo)
  },
  { 
    name: 'Trusted Agency Partner', 
    url: '/images/logos/logo-maroc-voyage.webp' // (e.g., An international travel agency)
  },
];
// --- END CUSTOMIZATION ---

export default function SocialProofSection() {
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
            mb: 6,
          }}
        >
          {/* This title ("Trusted by Travelers Worldwide") is already correct */}
          {content.socialProofTitle}
        </Typography>
        
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
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
              animation: 'scroll 40s linear infinite',
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {/* Render the new strategic logos twice for a seamless loop */}
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <Box
                key={`${logo.name}-${index}`}
                sx={{
                  position: 'relative',
                  width: { xs: 130, sm: 160 },
                  height: { xs: 65, sm: 80 },
                  mx: { xs: 3, sm: 5 },
                  flexShrink: 0,
                  filter: (theme) =>
                    theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
                  opacity: 0.5,
                  transition: 'opacity 0.4s ease-in-out',
                  '&:hover': {
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
                  sizes="160px"
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}