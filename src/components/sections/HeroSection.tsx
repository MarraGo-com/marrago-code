// /src/components/sections/HeroSection.tsx
'use client';

import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  
  // --- 1. Define the path to your video file ---
  // The video should be placed in your /public folder, e.g., /public/videos/hero-video.mp4
  const heroVideoUrl = '/videos/hero-video.mp4';

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '90vh', md: '100vh' },
        minHeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* --- 2. The Background Video --- */}
      {/* We use a <video> tag for auto-playing background videos. */}
      {/* It's muted, looped, and plays inline for a seamless effect. */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '50%',
          left: '50%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      >
        <source src={heroVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(120deg, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)', zIndex: 1 }} />
      
      {/* Content (remains the same) */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'common.white' }}>
        <Typography variant="h2" component="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' }, mb: 3, textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
          {t('title')}
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 5, maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' }, textShadow: '0 2px 8px rgba(0,0,0,0.6)', fontWeight: 400 }}>
          {t('subtitle')}
        </Typography>
        <Button variant="contained" size="large" component={Link} href="/experiences" sx={(theme) => ({ px: { xs: 3, md: 5 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: 'white', background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`})}>
          {t('button')}
        </Button>
      </Container>
    </Box>
  );
}
