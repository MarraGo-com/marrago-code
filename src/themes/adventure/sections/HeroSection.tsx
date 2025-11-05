// src/themes/adventure/sections/HeroSection.tsx
'use client';

import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from '@/i18n/navigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const clientTextContent = siteConfig.textContent;
  const heroContent = clientTextContent[locale]?.homepage || clientTextContent.en.homepage;

  const heroVideoUrl = '/videos/hero-video.mp4';
  const heroImageUrl = '/images/todra-gorge2.webp';

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '90vh', md: '100vh' },
        minHeight: 500,
        width: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Background Media Layer */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        {isMobile ? (
          <Image
            src={heroImageUrl}
            alt={heroContent.heroTitle}
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
          justifyContent: { xs: 'space-between', md: 'center' }, // Better space distribution on mobile
          textAlign: 'center',
          color: 'common.white',
          pt: { xs: '80px', md: '80px' },
          pb: { xs: '40px', md: '40px' },
          px: { xs: 2, md: 'auto' }, // Add horizontal padding on mobile
          gap: { xs: 3, md: 2 }, // Add consistent spacing between elements
          '& > *': {
            maxWidth: '100%', // Ensure content doesn't overflow container
          },
        }}
      >
        {/* H1 Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
            mb: { xs: 0, md: 2 }, // Remove margin bottom on mobile as we use gap
            textShadow: '0 3px 15px rgba(0,0,0,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            // Optimize for mobile
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, sm: 2 }, // Limit to 2 lines on all screens
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {heroContent.heroTitle}
        </Typography>

        {/* Slogan */}
        {siteConfig.slogan && (
          <Typography
            variant="h4"
            component="p"
            sx={(theme) => ({
              mb: 2,
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.5rem' },
              WebkitTextStroke: '0.5px white',
              textStroke: '0.5px white',
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              fontWeight: 500,
              color: theme.palette.secondary.light,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              // NEW: Add line clamp for slogan
              display: '-webkit-box',
              WebkitLineClamp: { xs: 3, sm: 2 }, // Max 3 lines on mobile, 2 on larger
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            })}
          >
            {siteConfig.slogan}
          </Typography>
        )}

        {/* Subtitle */}
        <Typography
          variant="h5"
          component="p"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            fontSize: { xs: '1.1rem', md: '1.1rem' },
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            fontWeight: 400,
            display: '-webkit-box',
            WebkitLineClamp: { xs: 3, sm: 3 }, // Limit to 3 lines
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            // Center the content vertically on mobile
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {heroContent.heroSubtitle}
        </Typography>

        {/* CTA Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          href="/experiences"
          startIcon={<PlayCircleOutlineIcon />}
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 1.5 },
            fontSize: { xs: '1rem', md: '1.1rem' },
            fontWeight: 700,
            borderRadius: '50px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            flexShrink: 0, // Prevent button from shrinking
          }}
        >
          {heroContent.heroCtaButtonText}
        </Button>
      </Container>
    </Box>
  );
}