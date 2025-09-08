// /src/themes/luxury/sections/SocialProofSection.tsx
'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
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
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            mb: 6, // Increased margin for more space
          }}
        >
          {t('title')}
        </Typography>
        
        {/* --- The Animated Scroller is back, but with a more elegant style --- */}
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
              // --- KEY CHANGES for Luxury Feel ---
              animation: 'scroll 40s linear infinite', // Slower, more graceful animation
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {/* Render the logos twice for a seamless loop */}
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
               <Box
                key={`${logo.name}-${index}`}
                sx={{
                  position: 'relative',
                  width: { xs: 130, sm: 160 },
                  height: { xs: 65, sm: 80 },
                  mx: { xs: 3, sm: 5 }, // Increased spacing
                  flexShrink: 0,
                  // --- KEY CHANGES for Luxury Feel ---
                  filter: (theme) => // Use grayscale in light mode, invert in dark
                    theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
                  opacity: 0.5, // Start with lower opacity
                  transition: 'opacity 0.4s ease-in-out',
                  '&:hover': {
                    opacity: 1, // Fade to full opacity on hover
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