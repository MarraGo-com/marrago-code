'use client';
// /src/themes/overrides/client-marrago/components/heroSection.tsx

import React, { useState } from 'react';
import { Typography, Button, Container, Box, IconButton, Stack, Paper, InputBase, useTheme, alpha } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';
import { siteConfig } from '@/config/client-data';

// --- ICONS ---
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HikingIcon from '@mui/icons-material/Hiking';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LandscapeIcon from '@mui/icons-material/Landscape'; 

// --- CONFIGURATION: Categories ---
const CATEGORIES = [
  { id: 'desert', label: 'Desert', icon: <LandscapeIcon /> },
  { id: 'food', label: 'Culinary', icon: <RestaurantIcon /> },
  { id: 'city', label: 'City', icon: <CameraAltIcon /> }, 
  { id: 'adventure', label: 'Hiking', icon: <HikingIcon /> },
  { id: 'transfers', label: 'Drivers', icon: <DirectionsCarIcon /> },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const locale = useLocale() as 'en' | 'fr' | 'ar'; 
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations('HeroSection'); 

  // --- SEARCH STATE ---
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeCategory) params.set('category', activeCategory);
    router.push(`/experiences?${params.toString()}`);
  };

  const handleCategoryClick = (id: string) => {
    setActiveCategory(activeCategory === id ? '' : id);
  };

  const handleSearchFocus = () => {
    if (swiperInstance && swiperInstance.autoplay) {
        swiperInstance.autoplay.stop();
    }
  };

  const handleSearchBlur = () => {
    if (swiperInstance && swiperInstance.autoplay) {
        swiperInstance.autoplay.start();
    }
  };

  const luxurySlides = siteConfig.textContent[locale]?.luxuryHomepageSlides || siteConfig.textContent.en.luxuryHomepageSlides || [];
  
  const currentSlide = luxurySlides.length > 0 ? luxurySlides[activeSlide] : { 
    image: '/images/default-luxury-hero.webp', 
    title: 'Experience Unparalleled Luxury', 
    subtitle: 'Your journey into extraordinary awaits.', 
  };

  // --- STATIC TITLE FOR MOBILE (PLG Strategy: Stability) ---
  const mobileTitle = t.has('mobileHeroTitle') ? t('mobileHeroTitle') : "Find Your Moroccan Adventure";
  const mobileSubtitle = t.has('mobileHeroSubtitle') ? t('mobileHeroSubtitle') : "Tours, Drivers & Authentic Experiences";

  return (
    <>
    <Box
      sx={{
        position: 'relative',
        height: { xs: '65vh', md: '100vh' }, // Reduced height on mobile to encourage scrolling
        minHeight: { xs: 500, md: 700 },
        display: 'flex',
        color: 'common.white',
        overflow: 'hidden',
        '& .swiper-button-next::after, & .swiper-button-prev::after': {
          content: '""',
        },
      }}
    >
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }} 
        effect="fade"
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}
      >
        {luxurySlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              style={{ objectFit: 'cover' }}
            />
            {/* Darker Gradient for Mobile Readability */}
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)' }} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center',
          pt: { xs: 0, md: 10 },
          px: { xs: 2, md: 3 }
        }}
      >
        {/* --- DESKTOP: DYNAMIC SLIDING TEXT --- */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}>
            <AnimatePresence mode="wait">
            <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{ width: '100%' }}
            >
                <Typography variant="h1" component="h1" sx={{ fontWeight: 600, fontSize: '4.5rem', color: 'common.white', textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: 1.1, mb: 2 }}>
                    {currentSlide.title}
                </Typography>
                <Typography variant="h5" component="p" sx={{ mb: 6, fontWeight: 300, fontSize: '1.25rem', color: 'grey.100', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {currentSlide.subtitle}
                </Typography>
            </motion.div>
            </AnimatePresence>
        </Box>

        {/* --- MOBILE: STATIC TEXT (No Layout Shift) --- */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', mb: 4 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, fontSize: '2.5rem', color: 'common.white', textShadow: '0 2px 15px rgba(0,0,0,0.6)', lineHeight: 1.2, mb: 1.5 }}>
                {mobileTitle}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', mb: 0 }}>
                {mobileSubtitle}
            </Typography>
        </Box>

        {/* --- THE DISCOVERY ENGINE --- */}
        <Box sx={{ width: '100%', maxWidth: '850px', mx: 'auto' }}>
            
            {/* A. CATEGORY CHIPS (DESKTOP ONLY) */}
            <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                    display: { xs: 'none', md: 'flex' }, // HIDE ON MOBILE
                    mb: 2, 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 1 
                }}
            >
                {CATEGORIES.map((cat) => (
                    <CategoryButton 
                        key={cat.id} 
                        cat={cat} 
                        isActive={activeCategory === cat.id} 
                        onClick={() => handleCategoryClick(cat.id)} 
                        t={t}
                    />
                ))}
            </Stack>

            {/* B. SEARCH BAR (ENHANCED FOR MOBILE) */}
            <Paper
                component="form"
                elevation={6}
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                sx={{ 
                    p: '6px 16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%', 
                    borderRadius: 50,
                    bgcolor: 'background.paper', 
                    border: '4px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    height: { xs: 60, md: 70 } // Taller on mobile for easier tapping
                }}
            >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: { xs: 24, md: 28 } }} />
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 500 }}
                    placeholder={t.has('placeholder') ? t('placeholder') : "Where to?"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                />
                
                <Box sx={{ display: { xs: 'none', sm: 'block' }, borderLeft: '1px solid #ddd', height: 28, mx: 1.5 }} />
                
                <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    sx={{ 
                        display: { xs: 'none', sm: 'flex' }, // Hide text button on very small screens, keep icon if needed
                        borderRadius: 50, 
                        px: 4, 
                        py: 1.2, 
                        fontWeight: 800,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        boxShadow: theme.shadows[4]
                    }}
                >
                    {t.has('searchButton') ? t('searchButton') : "Search"}
                </Button>
            </Paper>
        </Box>
      </Container>
      
      {/* NAVIGATION ARROWS (Desktop Only) */}
      <IconButton className="swiper-button-prev-custom" sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: 5, top: '50%', zIndex: 10, color: 'white', border: '1px solid rgba(255,255,255,0.3)', width: 50, height: 50 }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton className="swiper-button-next-custom" sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 5, top: '50%', zIndex: 10, color: 'white', border: '1px solid rgba(255,255,255,0.3)', width: 50, height: 50 }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>

    {/* --- NEW: MOBILE CATEGORY BAR (The "GetYourGuide/Airbnb" Pattern) --- */}
    {/* This sits OUTSIDE the hero image, creating a scrollable list below */}
    <Box 
        sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            overflowX: 'auto', 
            py: 2, 
            px: 2,
            gap: 1.5,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            // Hide Scrollbar
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
        }}
    >
        {CATEGORIES.map((cat) => (
             <Button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                startIcon={cat.icon}
                variant={activeCategory === cat.id ? "contained" : "outlined"}
                size="small"
                sx={{
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: 2.5,
                    py: 1,
                    borderColor: 'divider',
                    color: activeCategory === cat.id ? 'white' : 'text.primary',
                    boxShadow: 'none'
                }}
            >
                {t.has(`categories.${cat.id}`) ? t(`categories.${cat.id}`) : cat.label}
            </Button>
        ))}
    </Box>
    </>
  );
}

// Sub-component for cleaner code
function CategoryButton({ cat, isActive, onClick, t }: any) {
    return (
        <Button
            onClick={onClick}
            startIcon={cat.icon}
            variant="contained"
            size="small"
            sx={{
                borderRadius: 50,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: isActive ? 'primary.main' : alpha('#fff', 0.2), 
                color: 'common.white',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : alpha('#fff', 0.4),
                boxShadow: 'none',
                '&:hover': { bgcolor: isActive ? 'primary.dark' : alpha('#fff', 0.3) },
                minWidth: 'auto',
                px: 2
            }}
        >
            {t.has(`categories.${cat.id}`) ? t(`categories.${cat.id}`) : cat.label}
        </Button>
    );
}