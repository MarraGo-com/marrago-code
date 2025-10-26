// /src/themes/default/sections/ExperienceDetails.tsx
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import sub-components
import StickyBookingWidget from '@/components/booking/StickyBookingWidget';
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary';
import ImageGallery from '@/components/experience/ImageGallery';
import ReviewsList from '@/components/reviews/ReviewsList'; // Import ReviewsList
import LeaveReviewForm from '@/components/reviews/LeaveReviewForm'; // Import LeaveReviewForm
import { Experience } from '@/types/experience';
import { locations } from '@/config/locations';

export type ExperienceDetailsProps = {
  experience: Experience;
  clientConfig?: { 
    plugins: { 
      hasReviews?: boolean; 
      hasBookingEngine?: boolean; // <-- NEW: Add hasBookingEngine to clientConfig type
    } 
  };
};

export default function ExperienceDetails({ experience, clientConfig }: ExperienceDetailsProps) {
  const locale = useLocale();
  const t = useTranslations('ExperienceDetails');
  
  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  // RECTIFICATION: Access hasBookingEngine from clientConfig
  const showBookingWidget = clientConfig?.plugins?.hasBookingEngine;

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }} >
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
            {translation?.title || experience.title}
          </Typography>
          {location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">{location.name}</Typography>
            </Box>
          )}
        </Box>

        {/* Main Two-Column Layout */}
        <Grid container spacing={{ xs: 4, md: 8 }} >
          {/* Left Column: Main Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <ImageGallery 
              coverImage={experience.coverImage}
              galleryImages={experience.galleryImages || []}
              altText={translation?.title || experience.title || ''}
            />
            
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {translation?.description || experience.description}
            </Typography>

            <Divider sx={{ my: 4 }} />
            <Inclusions 
              included={translation?.included}
              notIncluded={translation?.notIncluded}
            />
            <Itinerary itinerary={translation?.itinerary} />

            {translation?.importantInfo && (
              <>
                <Divider sx={{ my: 4 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>{t('importantInfoTitle')}</Typography>
                  <Box sx={{ '& p, & ul, & li': { color: 'text.secondary' } }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{translation.importantInfo}</ReactMarkdown>
                  </Box>
                </Box>
              </>
            )}
          </Grid>

          {/* Right Column: Sticky Booking Widget - RECTIFICATION: Conditional Rendering */}
          {showBookingWidget && ( // <-- NEW: Only render if showBookingWidget is true
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: 'sticky', top: '80px' }}>
                <StickyBookingWidget 
                  experience={experience}
                  experienceId={experience.id}
                  experienceTitle={translation?.title || experience.title || ''}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        
        {/* --- THIS IS THE NEW, INTEGRATED REVIEWS SECTION --- */}
        {clientConfig?.plugins?.hasReviews && (
          <>
            <Divider sx={{ my: 8 }} />
            <ReviewsList experienceId={experience.id} />
            <LeaveReviewForm experienceId={experience.id} />
          </>
        )}
      </Container>
    </Box>
  );
}