// /src/themes/default/sections/ExperienceDetails.tsx
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Divider, Paper, useTheme } from '@mui/material';
import { useLocale } from 'next-intl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import shared components
import QuickFacts from '@/components/experience/QuickFacts';
import Highlights from '@/components/experience/Highlights';
import TourMap from '@/components/experience/TourMap';
import FAQAccordion from '@/components/experience/FAQAccordion';
import HelpBox from '@/components/experience/HelpBox';
import HeroActions from '@/components/experience/HeroActions';
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary';
import ImageGallery from '@/components/experience/ImageGallery';
import { Experience } from '@/types/experience';
import ReviewsList from '@/components/reviews/ReviewsList';
import LeaveReviewForm from '@/components/reviews/LeaveReviewForm';
import { locations } from '@/config/locations';
import BookingForm from '@/components/booking/BookingForm';

export type ExperienceDetailsProps = {
  experience: Experience;
  clientConfig?: { plugins: { hasReviews?: boolean; hasBookingEngine?: boolean } };
};

export default function ExperienceDetails({ experience, clientConfig }: ExperienceDetailsProps) {
  const locale = useLocale();
  const theme = useTheme();
 // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get the correct translation based on the current locale
  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  // Get data for conditional rendering
  const highlightsContent = translation?.highlights;
  const experienceTitle = translation?.title  || '';
  const faqsContent = translation?.faqs;
  const hasFaqs = faqsContent && faqsContent.length > 0;

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 10 }}>
      
      {/* 1. IMMERSIVE HERO SECTION */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '50vh', md: '70vh' }, // Taller on desktop for impact
        minHeight: '450px',
        display: 'flex',
        alignItems: 'flex-end',
        color: 'white',
        backgroundImage: `url(${experience.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Darker gradient for better text readability */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.4) 50%, transparent 100%)' }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: { xs: 4, md: 8 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
            
            {/* Title & Location */}
            <Box sx={{ maxWidth: { xs: '100%', md: '75%' } }}>
              {location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, opacity: 0.9 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                    {location.name.toUpperCase()}
                  </Typography>
                </Box>
              )}
              <Typography
                variant="h2"
                component="h1"
                sx={{ 
                  fontWeight: 800, 
                  lineHeight: 1.1,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {experienceTitle}
              </Typography>
            </Box>

            {/* Hero Actions (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 1 }}>
              <HeroActions title={experienceTitle} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Actions (Mobile - moved outside for easier tapping) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', px: 2, py: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
         <HeroActions title={experienceTitle} />
      </Box>

      {/* 2. MAIN CONTENT GRID */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 } }}>
        <Grid container spacing={6}>
          
          {/* === LEFT COLUMN: The Narrative === */}
          <Grid size={{ xs: 12, md: 7 }}>
            
            {/* A. Quick Facts (Wrapped in Card for "Pro" feel) */}
            <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3  }}>
               <QuickFacts 
                maxGuests={experience.maxGuests}
                languages={experience.languages}
                startTimes={experience.startTimes}
                tourCode={experience.tourCode}
              />
            </Paper>

            {/* B. Main Description */}
            <Box sx={{
                mb: 4,
                color: 'text.secondary',
                fontSize: '1.125rem',
                lineHeight: 1.8,
                '& p': { marginBottom: '1.5em' },
                '& strong': { fontWeight: 700, color: 'text.primary' },
                '& h3, & h4': { color: 'text.primary', fontWeight: 700, mt: 4, mb: 2 }
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {translation?.description || ''}
                </ReactMarkdown>
            </Box>

            {/* C. Image Gallery (Moved to Main Column for better Mobile UX) */}
            {/* Placing visuals right after the intro keeps the user engaged */}
            <Box sx={{ my: 6 }}>
               <ImageGallery
                  coverImage={experience.coverImage}
                  galleryImages={experience.galleryImages || []}
                  altText={experienceTitle}
                />
            </Box>

            {/* D. Highlights */}
            {highlightsContent && (
              <Box sx={{ mb: 6 }}>
                <Highlights highlights={highlightsContent} />
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* E. Inclusions & Exclusions */}
            <Inclusions
              included={translation?.included}
              notIncluded={translation?.notIncluded}
            />

            <Divider sx={{ my: 4 }} />

            {/* F. Detailed Itinerary */}
            <Itinerary itinerary={translation?.itinerary} />

            <Divider sx={{ my: 4 }} />

            {/* G. Map */}
            <Box sx={{ my: 4 }}>
               <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                 Where You'll Go
               </Typography>
               <TourMap latitude={experience.latitude} longitude={experience.longitude} />
            </Box>

            {/* H. FAQs */}
            {hasFaqs && (
              <Box sx={{ mt: 6 }}>
                 <Divider sx={{ mb: 6 }} />
                 <FAQAccordion faqs={faqsContent} />
              </Box>
            )}

            {/* I. Reviews (Integrated at the bottom of content) */}
             {clientConfig?.plugins?.hasReviews && (
              <Box sx={{ mt: 8 }}>
                <Divider sx={{ mb: 6 }} />
                <ReviewsList experienceId={experience.id} />
                <Box sx={{ mt: 4 }}>
                   <LeaveReviewForm experienceId={experience.id} />
                </Box>
              </Box>
            )}
          </Grid>

          {/* === RIGHT COLUMN: Sticky Sidebar (Action Oriented) === */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: { md: 'sticky' }, top: '100px', mb: 4 }}>
              
              {/* 1. Booking Form (High Elevation to pop) */}
              <Paper 
                elevation={4} 
                sx={{ 
                  p: { xs: 3, md: 4 }, 
                  borderRadius: 4, 
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h5" component="p" sx={{ fontWeight: 800, mb: 3, textAlign: 'center' }}>
                  Reserve Your Spot
                </Typography>
                <BookingForm
                  experienceId={experience.id}
                  experienceTitle={experienceTitle}
                  price={experience.price}
                />
              </Paper>

              {/* 2. Help Box (Reassurance) */}
              <Box sx={{ px: 1 }}>
                <HelpBox />
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}