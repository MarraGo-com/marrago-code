'use client';
// /src/themes/luxury/sections/HeroSection.tsx

import React, { useState } from 'react';
import { Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Link } from '@/i18n/navigation';

import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Import your Header components and slide data
import { heroSlides } from '../data/hero-slides';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

export default function HeroSection() {
  // Removed unused state: isScrolled, activeMenu, setActiveMenu
  const [activeSlide, setActiveSlide] = useState(0);

  const currentSlide = heroSlides[activeSlide];

  // Removed duplicate and unused useEffect hooks

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
        {heroSlides.map((slide, index) => (
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
          pb: { xs: 20, md: 22 },
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
            <Typography variant="h1" component="h1" sx={{ fontWeight: 500, fontSize: { xs: '2.8rem', md: '4.5rem' }, color: 'common.white', textShadow: '2px 2px 8px rgba(0,0,0,0.7)', lineHeight: 1.1, mb: 2 }}>
              {currentSlide.title}
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, fontWeight: 300, fontSize: { xs: '1rem', md: '1.2rem' },color: 'common.white', lineHeight: 1.7, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
              {currentSlide.subtitle}
            </Typography>
            <Button
                variant="contained"
                size="large"
                component={Link}
                href="/experiences"
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
            >
              {currentSlide.buttonText}
            </Button>
          </motion.div>
        </AnimatePresence>
      </Container>
      
      <IconButton
        className="swiper-button-prev-custom"
        sx={{
          display: { xs: 'none', md: 'flex' }, 
          position: 'absolute', 
          left: { xs: 5, md: 5 }, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 10, 
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.2)', 
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)'}, 
          transition: 'background-color 0.3s'
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        className="swiper-button-next-custom"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute', 
          right: { xs: 5, md: 5 }, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 10, 
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.2)', 
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)'}, 
          transition: 'background-color 0.3s'
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}
