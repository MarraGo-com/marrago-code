'use client';
// /src/themes/luxury/sections/HeroSection.tsx

import React, { useState } from 'react';
import { Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl'; 
import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// NEW IMPORT: clientTextContent from site.ts (which now gets it from client-text-data.ts)

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';
import { siteConfig } from '@/config/client-data';

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const locale = useLocale() as 'en' | 'fr' | 'ar'; 

  // Get the luxury homepage slides from clientTextContent based on locale
  // Fallback to English if the current locale's slides are not defined, or an empty array
  const luxurySlides = siteConfig.textContent[locale]?.luxuryHomepageSlides || siteConfig.textContent.en.luxuryHomepageSlides || [];

  // Ensure currentSlide is safely accessed, handling cases where luxurySlides might be empty
  const currentSlide = luxurySlides.length > 0 ? luxurySlides[activeSlide] : { 
    image: '/images/default-luxury-hero.webp', // Robust fallback image
    title: 'Experience Unparalleled Luxury', 
    subtitle: 'Your journey into extraordinary awaits.', 
    buttonText: 'Explore', 
    link: '/experiences' // Default link
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: 700,
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
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}
      >
        {/* Use luxurySlides from clientTextContent */}
        {luxurySlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              style={{ objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
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
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          textAlign: 'left',
          pb: { xs: 15, md: 17 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ maxWidth: '750px' }}
          >
            <Typography variant="h1" component="h1" sx={{ fontWeight: 500, fontSize: { xs: '2.8rem', md: '4.5rem' }, color: 'common.white', textShadow: '2px 2px 8px rgba(0,0,0,0.7)', lineHeight: 1.1, mb: 2 }}>{currentSlide.title}</Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, fontWeight: 300, fontSize: { xs: '1rem', md: '1.2rem' },color: 'common.white', lineHeight: 1.7, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{currentSlide.subtitle}</Typography>
            <Button
                variant="contained"
                size="large"
                component={Link}
                href={currentSlide.link}
                startIcon={<ArrowForwardIosIcon />}
                sx={{
                    color: 'common.black',
                    backgroundColor: 'common.white',
                    px: 4, py: 1.5,
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                }}
            >{currentSlide.buttonText}</Button>
          </motion.div>
        </AnimatePresence>
      </Container>
      
      {/* PREV BUTTON */}
      <IconButton
        className="swiper-button-prev-custom"
        sx={{
          display: { xs: 'none', md: 'flex' }, 
          position: 'absolute', 
          left: { xs: 2, md: 5 }, // Adjust position for smaller screens
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 10, 
          color: 'white',
          // NEW: No initial background, just border for subtle definition
          border: '1px solid rgba(255,255,255,0.3)', // Subtle white border
          backgroundColor: 'transparent', // No background initially
          // Make it circular and slightly larger
          width: { xs: 40, md: 50 }, // Increased size
          height: { xs: 40, md: 50 }, // Increased size
          borderRadius: '50%', // Make it circular
          // Hover effect: solid background with more opacity
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.2)', // Light background on hover
            borderColor: 'rgba(255,255,255,0.6)', // More visible border on hover
            transform: 'translateY(-50%) scale(1.05)', // Subtle scale effect
          }, 
          transition: 'all 0.3s ease-in-out', // Smooth transition for all properties
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} /> {/* Adjust icon size */}
      </IconButton>

      {/* NEXT BUTTON */}
      <IconButton
        className="swiper-button-next-custom"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute', 
          right: { xs: 2, md: 5 }, // Adjust position for smaller screens
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 10, 
          color: 'white',
          // NEW: No initial background, just border for subtle definition
          border: '1px solid rgba(255,255,255,0.3)', // Subtle white border
          backgroundColor: 'transparent', // No background initially
          // Make it circular and slightly larger
          width: { xs: 40, md: 50 }, // Increased size
          height: { xs: 40, md: 50 }, // Increased size
          borderRadius: '50%', // Make it circular
          // Hover effect: solid background with more opacity
          '&:hover': { 
            backgroundColor: 'rgba(255,255,255,0.2)', // Light background on hover
            borderColor: 'rgba(255,255,255,0.6)', // More visible border on hover
            transform: 'translateY(-50%) scale(1.05)', // Subtle scale effect
          }, 
          transition: 'all 0.3s ease-in-out', // Smooth transition for all properties
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} /> {/* Adjust icon size */}
      </IconButton>
    </Box>
  );
}