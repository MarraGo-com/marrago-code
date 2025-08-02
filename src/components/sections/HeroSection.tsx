// /src/components/sections/HeroSection.tsx
'use client';

import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
// import Image from 'next/image';

export default function HeroSection() {
  const t = useTranslations('HeroSection');
 // const theme = useTheme();
  
 // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 // const heroVideoUrl = '/videos/hero-video.mp4';
 // const heroImageUrl = '/images/hero-mobile-bg.webp';

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
        bgcolor: 'background.default',
      }}
    >
      {/* {isMobile ? (
        <Image
          src={heroImageUrl}
          alt={t('title')}
          fill
          style={{ objectFit: 'cover' }}
          priority // This correctly sets fetchpriority="high" for the image
          fetchPriority='high'
          sizes="100vw"
          // ✅ ENHANCEMENT: Adds a blurred placeholder.
          // Next.js automatically generates a tiny, blurred version of your image to show while
          // the full image loads. This significantly improves the perceived load time.
          placeholder="blur" 
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroImageUrl}
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
      )} */}
      
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(120deg, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)', zIndex: 1 }} />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'common.white' }}>
        {/* --- THIS IS THE KEY FIX --- */}
        {/* We restore this to an h1, as it's the main heading for the homepage. */}
        <Typography variant="h1" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' }, mb: 3, textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
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
