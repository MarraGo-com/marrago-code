// /src/themes/adventure/sections/ExperienceDetails.tsx
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Divider, Paper } from '@mui/material';
import { useLocale } from 'next-intl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
//import ReactMarkdown from 'react-markdown';
//import remarkGfm from 'remark-gfm';

// Import shared components
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary';
import ImageGallery from '@/components/experience/ImageGallery';
import BookingForm from '@/components/booking/BookingForm'; // Import BookingForm directly
import { Experience } from '@/types/experience';
import ReviewsList from '@/components/reviews/ReviewsList';
import LeaveReviewForm from '@/components/reviews/LeaveReviewForm';
import { locations } from '@/config/locations';

export type ExperienceDetailsProps = {
  experience: Experience;
  clientConfig?: { plugins: { hasReviews?: boolean; hasBookingEngine?: boolean } };
};

export default function ExperienceDetails({ experience, clientConfig }: ExperienceDetailsProps) {
  const locale = useLocale();
//  const t = useTranslations('ExperienceDetails');
  
  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* 1. Full-width, high-impact cover image */}
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '65vh', // A strong but not full-height banner
        minHeight: '450px', 
        display: 'flex', 
        alignItems: 'flex-end',
        color: 'white',
        backgroundImage: `url(${experience.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 20%, transparent 60%)' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: 6 }}>
            <Typography 
                variant="h2" 
                component="h1" 
                sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {translation?.title || experience.title}
            </Typography>
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body1">{location.name}</Typography>
              </Box>
            )}
        </Container>
      </Box>

      {/* 2. Main content area */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={8}>
          {/* Left Column: Details & Itinerary */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h5" component="p" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.7 }}>
              {translation?.description || experience.description}
            </Typography>
            <Divider sx={{ my: 5 }} />
            <Inclusions 
              included={translation?.included}
              notIncluded={translation?.notIncluded}
            />
            <Divider sx={{ my: 5 }} />
            <Itinerary itinerary={translation?.itinerary} />
          </Grid>

          {/* Right Column: Booking & Gallery */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: '100px' }}>
              {/* Booking Form is now integrated directly */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                  <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Book This Adventure
                  </Typography>
                  <BookingForm 
                    experienceId={experience.id}
                    experienceTitle={translation?.title || experience.title || ''}
                    price={experience.price}
                  />
              </Paper>

              {/* Gallery is now a secondary element */}
              <ImageGallery 
                coverImage={experience.coverImage}
                galleryImages={experience.galleryImages || []}
                altText={translation?.title || experience.title || ''}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Integrated reviews section */}
      {clientConfig?.plugins?.hasReviews && (
        <Container maxWidth="lg">
          <Divider sx={{ my: 6 }} />
          <ReviewsList experienceId={experience.id} />
          <LeaveReviewForm experienceId={experience.id} />
        </Container>
      )}
    </Box>
  );
}