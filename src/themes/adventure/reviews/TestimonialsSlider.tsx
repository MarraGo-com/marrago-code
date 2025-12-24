'use client';

import React from 'react';
import { Box, Card, Typography, Avatar, Rating, Stack, Chip, useTheme, alpha } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useTranslations } from 'next-intl';
import VerifiedIcon from '@mui/icons-material/Verified';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Review } from '@/types/review';



export default function TestimonialsSlider({ reviews }: { reviews: Review[] }) {
  const theme = useTheme();
 const t = useTranslations('Reviews');
 

  return (
    <Box sx={{ position: 'relative', px: { xs: 2, md: 4 } }}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={32}
        slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 6000, disableOnInteraction: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          900: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: '60px' }} 
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} style={{ height: 'auto' }}>
            {/* --- THE NEW "WORLD CLASS" CARD --- */}
            <Card
              elevation={0}
              sx={{
                height: '100%',
                p: 4,
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider', // Subtle border
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main' // Green glow on hover
                }
              }}
            >
              {/* 1. HEADER: Author & Verified Status */}
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Avatar 
                    src={review.avatar} 
                    alt={review.author} 
                    sx={{ width: 48, height: 48, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}
                >
                    {review.author?.charAt(0) || "T"}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {review.author}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                             {review.location || "Traveler"}
                        </Typography>
                        
                        {/* THE "VERIFIED" BADGE - The key visual change */}
                        {review.isVerifiedBooking && (
                             <Chip 
                                icon={<VerifiedIcon sx={{ fontSize: '12px !important' }} />} 
                                label={t('verifiedBooking') || "Verified Booking"} 
                                size="small" 
                                sx={{ 
                                    height: 20, 
                                    fontSize: '0.65rem', 
                                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                                    color: 'success.main',
                                    fontWeight: 'bold',
                                    ml: 1,
                                    '& .MuiChip-icon': { color: 'success.main' }
                                }} 
                             />
                        )}
                    </Stack>
                </Box>
              </Stack>

              {/* 2. RATING (TripAdvisor Green) */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                 <Rating 
                    value={review.rating} 
                    readOnly 
                    size="small" 
                    sx={{ color: '#00AA6C' /* TripAdvisor Green Color */ }} 
                 />
                 {review.date && (
                     <Typography variant="caption" color="text.secondary">
                         • {review.date}
                     </Typography>
                 )}
              </Stack>

              {/* 3. REVIEW TEXT */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1, fontStyle: 'italic', lineHeight: 1.6 }}>
                "{review.text}"
              </Typography>

              {/* 4. FOOTER: Traveler Type */}
              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                 <Stack direction="row" justifyContent="space-between" alignItems="center">
                     <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                         {t('traveledAs') || "Traveled as"} <Box component="span" sx={{ color: 'primary.main' }}>{review.travelerType || "Couple"}</Box>
                     </Typography>
                 </Stack>
              </Box>

            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}