// src/themes/adventure/sections/HeroSection.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Button, Container, Box, Stack, InputBase, Paper, IconButton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

// Icons for the "Discovery Engine"
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HikingIcon from '@mui/icons-material/Hiking';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LandscapeIcon from '@mui/icons-material/Landscape'; 
import StarIcon from '@mui/icons-material/Star';

import { siteConfig } from '@/config/client-data';

// --- CONFIGURATION: Categories (Airbnb Style) ---
// You can move this to a config file later
const CATEGORIES = [
  { id: 'desert', label: 'Desert', icon: <LandscapeIcon /> },
  { id: 'food', label: 'Culinary', icon: <RestaurantIcon /> },
  { id: 'city', label: 'City Tours', icon: <CameraAltIcon /> },
  { id: 'adventure', label: 'Hiking', icon: <HikingIcon /> },
  { id: 'transfers', label: 'Drivers', icon: <DirectionsCarIcon /> },
  { id: 'featured', label: 'Icons', icon: <StarIcon /> },
];

export default function HeroSection() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Localization
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const t = useTranslations('HeroSection'); // For new UI elements (Search/Chips)
  
  // Existing Content from SiteConfig
  const clientTextContent = siteConfig.textContent;
  const heroContent = clientTextContent[locale]?.homepage || clientTextContent.en.homepage;

  const heroVideoUrl = '/videos/hero-video.mp4';
  const heroImageUrl = '/images/todra-gorge2.webp';

  // --- STATE FOR SEARCH ENGINE ---
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeCategory) params.set('category', activeCategory);
    router.push(`/experiences?${params.toString()}`);
  };

  const handleCategoryClick = (id: string) => {
    const newCategory = activeCategory === id ? '' : id;
    setActiveCategory(newCategory);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '90vh', md: '100vh' },
        minHeight: 600, // Slightly increased for search UI
        width: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* 1. BACKGROUND MEDIA LAYER (Unchanged) */}
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

      {/* 2. GRADIENT OVERLAY (Unchanged) */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        zIndex: 2
      }} />

      {/* 3. CONTENT LAYER (Upgraded) */}
      <Container
        maxWidth="lg" // Increased width for Search Bar
        sx={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pt: { xs: 10, md: 0 },
          px: { xs: 2, md: 4 }
        }}
      >
        {/* HEADLINES */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
            mb: 2,
            color: 'common.white',
            textShadow: '0 3px 15px rgba(0,0,0,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.1
          }}
        >
          {heroContent.heroTitle}
        </Typography>

        {siteConfig.slogan && (
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              maxWidth: 800,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              color: 'grey.100',
              fontWeight: 500,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {siteConfig.slogan}
          </Typography>
        )}

        {/* --- THE "UNBEATABLE" DISCOVERY ENGINE --- */}
        <Box sx={{ width: '100%', maxWidth: '850px', mt: 2 }}>
            
            {/* A. CATEGORY CHIPS (Airbnb Style) */}
            <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                    mb: 2, 
                    overflowX: 'auto', 
                    pb: 1, 
                    justifyContent: { xs: 'flex-start', md: 'center' },
                    // Hide scrollbar but keep functionality
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    maskImage: { xs: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', md: 'none' }
                }}
            >
                {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <Button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            startIcon={cat.icon}
                            variant="contained"
                            sx={{
                                borderRadius: 50,
                                textTransform: 'none',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                bgcolor: isActive ? 'primary.main' : alpha('#fff', 0.15), // Glassmorphism
                                color: isActive ? 'primary.contrastText' : 'common.white',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: isActive ? 'primary.main' : alpha('#fff', 0.3),
                                '&:hover': {
                                    bgcolor: isActive ? 'primary.dark' : alpha('#fff', 0.25),
                                },
                                transition: 'all 0.2s ease',
                                minWidth: 'auto',
                                px: 2.5
                            }}
                        >
                            {/* We use translation key or fallback to label */}
                            {t.has(`categories.${cat.id}`) ? t(`categories.${cat.id}`) : cat.label}
                        </Button>
                    );
                })}
            </Stack>

            {/* B. SEARCH BAR (Booking.com Style) */}
            <Paper
                component="form"
                elevation={6}
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                sx={{ 
                    p: '8px 16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%', 
                    borderRadius: 50,
                    bgcolor: 'background.paper', // Uses theme background (Dark/Light aware)
                    border: '4px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.5) // Glowing brand border
                }}
            >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 28 }} />
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '1.1rem', fontWeight: 500 }}
                    placeholder={t.has('placeholder') ? t('placeholder') : "Where do you want to go?"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <Box sx={{ display: { xs: 'none', sm: 'block' }, borderLeft: '1px solid #ddd', height: 30, mx: 2 }} />
                
                <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleSearch}
                    sx={{ 
                        borderRadius: 50, 
                        px: 4, 
                        py: 1.5, 
                        fontWeight: 800,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: theme.shadows[4]
                    }}
                >
                     {t.has('searchButton') ? t('searchButton') : "Search"}
                </Button>
            </Paper>

        </Box>

      </Container>
     
    </Box>
  );
}