// /src/themes/adventure/sections/HeroSection.tsx
'use client';

import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // An action-oriented icon

// Import the adventure Header component
// (We will create/refactor this later, for now it can point to the default)
// import Header from '../../default/ui/Header';

export default function HeroSection() {
  const t = useTranslations('AgencyHero'); // Reusing the same translation keys
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use a more dynamic, action-oriented video and image
  const heroVideoUrl = '/videos/hero-video.mp4'; // You can swap this with a more adventurous video
  const heroImageUrl = '/images/todra-gorge2.webp';

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
      {/* The Header floats on top */}
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

      {/* A more dramatic gradient overlay */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)', 
        zIndex: 2 
      }} />

      {/* Centered Text Content Layer */}
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
        {/* --- THIS IS THE KEY "ADVENTURE" CHANGE --- */}
        <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
                // Using the modern, bold Poppins font (or your theme's default sans-serif)
                fontWeight: 800, 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' }, 
                mb: 2, 
                textShadow: '0 3px 15px rgba(0,0,0,0.6)',
                textTransform: 'uppercase', // Bold, uppercase text
                letterSpacing: '0.05em',
            }}
        >
          {t('title')}
        </Typography>
        <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
                mb: 4, 
                maxWidth: 600, 
                mx: 'auto', 
                fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                textShadow: '0 2px 8px rgba(0,0,0,0.7)', 
                fontWeight: 400 
            }}
        >
          {t('subtitle')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          href="/experiences"
          startIcon={<PlayCircleOutlineIcon />}
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 700,
            borderRadius: '50px', // A modern, pill-shaped button
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.05)',
            }
          }}
        >
          {t('ctaButton')}
        </Button>
      </Container>
    </Box>
  );
}