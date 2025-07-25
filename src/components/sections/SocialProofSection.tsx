// /src/components/sections/SocialProofSection.tsx
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
            mb: 4,
          }}
        >
          {t('title')}
        </Typography>
        
        {/* --- THIS IS THE NEW ANIMATED SCROLLER --- */}
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            // Add a subtle gradient mask on the edges for a fade-out effect
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: 'fit-content',
              // Define the animation
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' }, // Move by half the total width for a seamless loop
              },
              animation: 'scroll 30s linear infinite',
              '&:hover': {
                animationPlayState: 'paused', // Pause the animation on hover
              },
            }}
          >
            {/* We render the list of logos twice to create the seamless loop */}
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <Box
                key={`${logo.name}-${index}`}
                sx={{
                  position: 'relative',
                  width: { xs: 120, sm: 150 },
                  height: { xs: 60, sm: 80 },
                  mx: { xs: 2, sm: 4 }, // Add horizontal margin for spacing
                  flexShrink: 0, // Prevent logos from shrinking
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
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
