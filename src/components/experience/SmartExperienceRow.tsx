'use client';

import React, { useRef } from 'react';
import { Box, Typography, Container, Button, useTheme, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Experience } from '@/types/experience';
import ExperienceCard from '@/themes/adventure/cards/ExperienceCard';
import Link from 'next/link';

interface SmartExperienceRowProps {
  title: string;
  subtitle?: string;
  experiences: Experience[];
  viewAllLink?: string;
  variant?: 'default' | 'alternate'; 
  viewAllLabel?: string; 
}

export default function SmartExperienceRow({ 
  title, 
  subtitle, 
  experiences, 
  viewAllLink, 
  variant = 'default',
  viewAllLabel = 'View All' 
}: SmartExperienceRowProps) {

  const theme = useTheme();
  // Ref to hold the Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);

  // Background logic
  const backgroundColor = variant === 'alternate' 
    ? (theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50')
    : 'background.default';

  if (!experiences || experiences.length === 0) return null;

  // --- 🔧 FIX: STRIP ALL NON-ALPHANUMERIC CHARACTERS ---
  // "Travelers' Choice" -> "TravelersChoice" (Valid CSS Class)
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '');
  const prevClass = `prev-${safeTitle}`;
  const nextClass = `next-${safeTitle}`;

  // Custom Navigation Button Style (Airbnb / TripAdvisor style)
  const navButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    bgcolor: 'background.paper',
    color: 'text.primary',
    width: 40,
    height: 40,
    boxShadow: theme.shadows[3],
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        bgcolor: 'background.default',
        boxShadow: theme.shadows[6]
    },
    '&.swiper-button-disabled': {
        opacity: 0, // Hide when disabled (start/end)
        pointerEvents: 'none'
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: backgroundColor }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
            <Box>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body1" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
            
            {viewAllLink && (
                <Button 
                    component={Link} 
                    href={viewAllLink}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 'bold', textTransform: 'none', display: { xs: 'none', sm: 'flex' } }}
                >
                    {viewAllLabel}
                </Button>
            )}
        </Box>

        <Box sx={{ position: 'relative' }}>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1.2}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                    1400: { slidesPerView: 4.2 },
                }}
                style={{ paddingBottom: '50px', paddingLeft: '4px', paddingRight: '4px' }}
            >
                {experiences.map((exp) => (
                    <SwiperSlide key={exp.id}>
                        <Box sx={{ height: '100%', pb: 1 }}> 
                           <ExperienceCard experience={exp} />
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* CUSTOM PREV BUTTON */}
            <IconButton 
                className={prevClass}
                sx={{ ...navButtonStyle, left: -20, display: { xs: 'none', md: 'flex' } }}
                aria-label="Previous slide"
            >
                <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            {/* CUSTOM NEXT BUTTON */}
            <IconButton 
                className={nextClass}
                sx={{ ...navButtonStyle, right: -20, display: { xs: 'none', md: 'flex' } }}
                aria-label="Next slide"
            >
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </Box>
        
        {/* Mobile View All Button */}
        {viewAllLink && (
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 2 }}>
                <Button component={Link} href={viewAllLink} endIcon={<ArrowForwardIcon />} fullWidth variant="outlined">
                    {viewAllLabel}
                </Button>
            </Box>
        )}
      </Container>
    </Box>
  );
}