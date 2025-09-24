// /src/themes/luxury/sections/ExperienceDetails.tsx
'use client';

import React from 'react';
import { Typography, Box, Container, Divider, Grid } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import shared components
// import StickyBookingWidget from '@/components/booking/StickyBookingWidget';
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary';
import ImageGallery from '@/components/experience/ImageGallery';
import { Experience } from '@/types/experience';
import { locations } from '@/config/locations';
import dynamic from 'next/dynamic';
import { ReviewsListProps } from '../reviews/ReviewsList';
import { LeaveReviewFormProps } from '../reviews/LeaveReviewForm';
import { BookingWidgetProps } from '@/components/booking/StickyBookingWidget';
import Image from 'next/image';

//////////////////////////////////////////////////////////////////////////
// Dynamically import the new luxury review components
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ReviewsList = dynamic<ReviewsListProps>(() => import(`@/themes/${theme}/reviews/ReviewsList`));
const LeaveReviewForm = dynamic<LeaveReviewFormProps>(() => import(`@/themes/${theme}/reviews/LeaveReviewForm`));
const StickyBookingWidget = dynamic<BookingWidgetProps>(() => import(`@/components/booking/StickyBookingWidget`));

export type ExperienceDetailsProps = {
  experience: Experience;
  clientConfig: { plugins: { hasReviews?: boolean } }; // Pass the client config here
};

export default function ExperienceDetails({ experience, clientConfig }: ExperienceDetailsProps) {
  const locale = useLocale();
  const t = useTranslations('ExperienceDetails');
  
  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  return (
      <Box sx={{ bgcolor: 'background.paper' }}>
      {/* 1. Full-width, immersive cover image - REFACTORED */}
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '70vh', 
        minHeight: '500px', 
        color: 'white',
      }}>
        {/* --- THIS IS THE KEY CHANGE --- */}
        <Image
          src={experience.coverImage}
          alt={translation?.title || experience.title || 'Cover image for the experience'}
          fill
          style={{ objectFit: 'cover' }}
          priority // Tells Next.js to load this important image first
        />
        
        {/* The overlay and text now sit on top of the Image component */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 20%, transparent 60%)' }} />
        
        <Box sx={{
          position: 'relative', // Stacks on top of the overlay
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <Container maxWidth="lg" sx={{ pb: 8 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ fontWeight: 'bold' }}
            >
              {translation?.title || experience.title}
            </Typography>
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body1">{location.name}</Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Box>

      {/* 2. Centered, single-column content layout */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container justifyContent="center">
          <Grid  size={{ xs: 12, lg: 10 }}>
            {/* Description */}
            <Typography variant="h5" component="p" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.7, fontStyle: 'italic' }}>
              {translation?.description || experience.description}
            </Typography>

            <Divider sx={{ my: 6 }} />

            {/* Gallery */}
            <ImageGallery 
              coverImage={experience.coverImage}
              galleryImages={experience.galleryImages || []}
              altText={translation?.title || experience.title || ''}
            />

            <Divider sx={{ my: 6 }} />

            {/* Inclusions */}
            <Inclusions 
              included={translation?.included}
              notIncluded={translation?.notIncluded}
            />

            <Divider sx={{ my: 6 }} />
            
            {/* Itinerary */}
            <Itinerary itinerary={translation?.itinerary} />

            {/* Important Info */}
            {translation?.importantInfo && (
              <>
                <Divider sx={{ my: 6 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>{t('importantInfoTitle')}</Typography>
                  <Box sx={{ '& h2, & h3': { my: 2 }, '& p, & ul, & li': { color: 'text.secondary' }, lineHeight: 1.8 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{translation.importantInfo}</ReactMarkdown>
                  </Box>
                </Box>
              </>
            )}
            <Divider sx={{ my: 6 }} />
             {/* --- THIS IS THE NEW, INTEGRATED REVIEWS SECTION --- */}
            {clientConfig?.plugins?.hasReviews && (
              <>
                <Divider sx={{ my: 8 }} />
                <ReviewsList experienceId={experience.id} />
                <LeaveReviewForm experienceId={experience.id} />
              </>
            )}
            {/* Booking Widget is now at the end of the content flow */}
             <Divider sx={{ my: 6 }} />
             <Box sx={{ position: 'sticky', top: '80px' }}>
                <StickyBookingWidget 
                    experience={experience}
                    experienceId={experience.id}
                    experienceTitle={translation?.title || experience.title || ''}
                />
             </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}