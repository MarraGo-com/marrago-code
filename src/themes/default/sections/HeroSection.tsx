// /src/themes/default/sections/HeroSection.tsx
'use client';

import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

// Import the default Header component
// import Header from '../ui/Header';

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const heroVideoUrl = '/videos/hero-video.mp4';
  const heroImageUrl = '/images/profound-celestial-masterpiece.webp';

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '90vh', md: '100vh' },
        minHeight: 500,
        width: '100%',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* --- THIS IS THE FIX --- */}
      {/* Header is now positioned absolutely within the relative parent Box */}
      {/* It is no longer inside a flex container */}
      {/* <Header /> */}

      {/* Background Media Layer */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        {isMobile ? (
          <Image
            src={heroImageUrl}
            alt={t('title')}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={heroImageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        )}
      </Box>

      {/* Gradient Overlay Layer */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(120deg, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)', 
        zIndex: 2 
      }} />

      {/* Centered Text Content Layer */}
      {/* This Container uses Flexbox to center its own content vertically and horizontally */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'common.white',
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' }, mb: 3, textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
          {t('title')}
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 5, maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' }, textShadow: '0 2px 8px rgba(0,0,0,0.6)', fontWeight: 400 }}>
          {t('subtitle')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/experiences"
          sx={(theme) => ({
            px: { xs: 3, md: 5 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 700,
            color: 'white',
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          })}
        >
          {t('ctaButton')}
        </Button>
      </Container>
    </Box>
  );
}