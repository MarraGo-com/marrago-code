// /src/themes/adventure/reviews/TestimonialsSlider.tsx
'use client';

import React from 'react';
import { Box, IconButton } from "@mui/material";
import { Review } from "@/types/review";
import TestimonialCard from './TestimonialCard';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface TestimonialsSliderProps {
  reviews: Review[];
}

export default function TestimonialsSlider({ reviews }: TestimonialsSliderProps) {
  return (
    <Box sx={{ position: 'relative', px: { xs: 0, md: 5 } }}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next-testimonials',
          prevEl: '.swiper-button-prev-testimonials',
        }}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: '50px' }} // Space for pagination dots
      >
        {reviews.map((review: Review) => (
          <SwiperSlide key={review.id} style={{ height: 'auto' }}>
            <TestimonialCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Arrows */}
      <IconButton className="swiper-button-prev-testimonials" sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: { xs: 'none', md: 'flex' } }}>
        <ArrowBackIcon />
      </IconButton>
      <IconButton className="swiper-button-next-testimonials" sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: { xs: 'none', md: 'flex' } }}>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
}