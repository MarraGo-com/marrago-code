// /src/themes/luxury/sections/ExperienceDetails.tsx
'use client';

import React from 'react';
import { Typography, Box, Container, Divider, Grid } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import shared components
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary';
import ImageGallery from '@/components/experience/ImageGallery';
import { Experience } from '@/types/experience';
import { locations } from '@/config/locations';
import dynamic from 'next/dynamic';
import { BookingWidgetProps } from '@/components/booking/StickyBookingWidget';
import Image from 'next/image';
import { ReviewsListProps } from '../reviews/ReviewsList';
import { LeaveReviewFormProps } from '../reviews/LeaveReviewForm';

//////////////////////////////////////////////////////////////////////////
// Dynamically import the new luxury review components
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ReviewsList = dynamic<ReviewsListProps>(() => import(`@/themes/${theme}/reviews/ReviewsList`));
const LeaveReviewForm = dynamic<LeaveReviewFormProps>(() => import(`@/themes/${theme}/reviews/LeaveReviewForm`));
const StickyBookingWidget = dynamic<BookingWidgetProps>(() => import(`@/components/booking/StickyBookingWidget`));

export type ExperienceDetailsProps = {
  experience: Experience;
  clientConfig: { plugins: { hasReviews?: boolean } };
};

export default function ExperienceDetails({ experience, clientConfig }: ExperienceDetailsProps) {
  const locale = useLocale();
  const t = useTranslations('ExperienceDetails');

  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      {/* 1. Full-width, immersive cover image */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        minHeight: '500px',
        color: 'white',
      }}>
        <Image
          src={experience.coverImage}
          alt={translation?.title || experience.title || 'Cover image for the experience'}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />

        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)' }} />

        <Box sx={{
          position: 'relative',
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
              sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {translation?.title || experience.title}
            </Typography>
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
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
          <Grid size={{ xs: 12, lg: 10 }}>
            {/* Description - FIXED to use ReactMarkdown */}
            <Box sx={{
                mb: 4,
                color: 'text.secondary',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontStyle: 'italic',
                // Add styles for Markdown elements to match the luxury theme
                '& p': { marginBottom: '1.5em' },
                '& strong': { fontWeight: 600, color: 'text.primary', fontStyle: 'normal' },
                '& ul, & ol': { paddingLeft: '1.5em', marginBottom: '1.5em' },
                '& li': { marginBottom: '0.5em' },
                '& h3, & h4': { color: 'text.primary', fontWeight: 'bold', mt: 4, mb: 2, fontStyle: 'normal', textAlign: 'center' }
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {translation?.description || experience.description}
              </ReactMarkdown>
            </Box>

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
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>{t('importantInfoTitle')}</Typography>
                  <Box sx={{ '& h2, & h3': { my: 2 }, '& p, & ul, & li': { color: 'text.secondary' }, lineHeight: 1.8, fontSize: '1.05rem' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{translation.importantInfo}</ReactMarkdown>
                  </Box>
                </Box>
              </>
            )}
            
            {/* Booking Widget at the end */}
            <Divider sx={{ my: 8 }} />
            <Box sx={{ position: 'sticky', top: '80px', py: 4 }}>
              <StickyBookingWidget
                  experience={experience}
                  experienceId={experience.id}
                  experienceTitle={translation?.title || experience.title || ''}
              />
            </Box>

             {/* Reviews section */}
            {clientConfig?.plugins?.hasReviews && (
              <>
                <Divider sx={{ my: 8 }} />
                <ReviewsList experienceId={experience.id} />
                <LeaveReviewForm experienceId={experience.id} />
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}