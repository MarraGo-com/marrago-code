'use client';

import React from 'react';
import { Box, Typography, Container, Skeleton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useTranslations } from 'next-intl';

// Import your existing card
import ExperienceCard from '@/themes/adventure/cards/ExperienceCard'; 
import { useSimilarExperiences } from '@/hooks/useSimilarExperiences';

interface SimilarExperiencesProps {
  currentExperienceId: string;
  locationId: string;
}

export default function SimilarExperiences({ currentExperienceId, locationId }: SimilarExperiencesProps) {
  const { experiences, loading } = useSimilarExperiences(currentExperienceId, locationId);
  const t = useTranslations('ExperienceDetails');

  // If loading finished and 0 results, hide section
  if (!loading && experiences.length === 0) return null;

  return (
    <Box sx={{ py: 8, bgcolor: 'action.hover' }}> 
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
          {t('similarTours')} 
        </Typography>

        {loading ? (
          // Loading Skeleton
          <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden' }}>
            {[1, 2, 3].map((i) => (
              <Skeleton 
                key={i} 
                variant="rectangular" 
                width={350} 
                height={400} 
                sx={{ borderRadius: 3, bgcolor: 'background.paper' }} 
              />
            ))}
          </Box>
        ) : (
          // The Carousel
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1.2} // Mobile peeking effect
            navigation
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.5 },
            }}
            style={{ paddingBottom: '40px' }}
          >
            {experiences.map((exp) => (
              <SwiperSlide key={exp.id}>
                <Box sx={{ height: '100%' }}>
                   {/* Card will now receive the strict typed Experience object */}
                   <ExperienceCard experience={exp} />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </Box>
  );
}