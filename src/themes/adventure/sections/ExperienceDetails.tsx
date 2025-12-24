// src/components/experience/ExperienceDetails.tsx
'use client';

import React, { useState } from 'react';
import { 
  Grid, Typography, Box, Container, Divider, Paper, Stack, useTheme, 
  Chip, Drawer, IconButton, useMediaQuery 
} from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- ICONS (Trust & Scarcity) ---
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt'; // Instant Confirmation
import EventBusyIcon from '@mui/icons-material/EventBusy'; // Free Cancellation
import CloseIcon from '@mui/icons-material/Close'; 

// Import shared components
import QuickFacts from '@/components/experience/QuickFacts';
import Highlights from '@/components/experience/Highlights';
import TourMap from '@/components/experience/TourMap';
import FAQAccordion from '@/components/experience/FAQAccordion';
import HelpBox from '@/components/experience/HelpBox';
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary'; 
import { Experience } from '@/types/experience';
import ReviewsList from '@/components/reviews/ReviewsList';
import LeaveReviewForm from '@/components/reviews/LeaveReviewForm';
import { locations } from '@/config/locations';
import BookingForm from '@/components/booking/BookingForm';

// --- NEW IMPORTS ---
import HeroMasonry from './HeroMasonry';
import MobileBookingBar from '@/components/booking/MobileBookingBar';
import ItineraryTimeline from '@/components/experience/ItineraryTimeline';
import StickyExperienceHeader from '@/components/experience/StickyExperienceHeader';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProviderCard from '@/components/experience/ProviderCard';
import SimilarExperiences from '@/components/experience/SimilarExperiences';
import { SiteConfig } from '@/config/site';

export type ExperienceDetailsProps = {
  experience: Experience;
  clientConfig?: SiteConfig;
};

export default function ExperienceDetails({ experience, clientConfig }: ExperienceDetailsProps) {
  const locale = useLocale();
  const t = useTranslations('ExperienceDetails'); 
  const tCommon = useTranslations('Common');
  const theme = useTheme(); 
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // --- STATE: Mobile Booking Drawer ---
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

  const toggleBookingDrawer = () => {
    setIsBookingDrawerOpen(!isBookingDrawerOpen);
  };

  // Get the correct translation based on the current locale
  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  // Get data for conditional rendering
  const highlightsContent = translation?.highlights;
  const experienceTitle = translation?.title  || '';
  const faqsContent = translation?.faqs;
  const hasFaqs = faqsContent && faqsContent.length > 0;

  // --- LOGIC: Scarcity & Urgency ---
  const isLikelyToSellOut = experience.scarcity?.isLikelyToSellOut || (experience.scarcity?.spotsLeft && experience.scarcity.spotsLeft < 10);
  const spotsLeft = experience.scarcity?.spotsLeft || 20;

  // Localized Breadcrumbs
  const breadcrumbItems = [
    { label: t('breadcrumbs.experiences'), href: '/experiences' },
    // Fix: Use translation fallback for country if location name is missing
    { label: location?.name || t('breadcrumbs.country'), href: `/experiences?location=${experience.locationId}` },
    { label: experienceTitle, href: undefined }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 10 }}>
      
      {/* 1. STICKY HEADER */}
      <StickyExperienceHeader 
        title={experienceTitle}
        price={experience.price}
        rating={experience.rating || 0} 
        reviewCount={experience.reviewCount || 0} 
        onBook={toggleBookingDrawer} 
      />

      <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 4 } }}>
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* HERO */}
        <HeroMasonry 
           coverImage={experience.coverImage}
           galleryImages={experience.galleryImages || []}
           title={experienceTitle}
        />

        {/* 2. TITLE HEADER & TRUST SIGNALS */}
        <Box sx={{ mb: 4, mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                {location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="overline" color="primary.main" fontWeight="bold" letterSpacing={1.5}>
                            {location.name.toUpperCase()}
                        </Typography>
                    </Box>
                )}
                {/* SCARCITY BADGE */}
                {isLikelyToSellOut && (
                    <Chip 
                        label={t('scarcity.likelyToSellOut')} // <--- FIXED
                        size="small" 
                        color="error" 
                        sx={{ fontWeight: 'bold', height: 20, fontSize: '0.7rem' }} 
                    />
                )}
            </Stack>

            <Typography
                variant="h2"
                component="h1"
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '2rem', md: '3rem' },
                  color: 'text.primary',
                  lineHeight: 1.1,
                  mb: 2
                }}
            >
                {experienceTitle}
            </Typography>

            {/* TRUST SIGNALS (Above the Fold) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                        {translation?.duration || `${experience.durationValue} ${tCommon(`units.${experience.durationUnit}`, { count: experience.durationValue })}`}
                    </Typography>
                </Box>
                {/* Free Cancellation */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventBusyIcon fontSize="small" color="success" />
                    {/* FIXED: Uses t('trust.freeCancellation') */}
                    <Typography variant="body2" color="success.main" fontWeight="500">
                        {t('trust.freeCancellation')}
                    </Typography>
                </Box>
                {/* Instant Confirmation */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                     <BoltIcon fontSize="small" color="action" />
                     {/* FIXED: Uses t('trust.instantConfirmation') */}
                     <Typography variant="body2">
                        {t('trust.instantConfirmation')}
                     </Typography>
                </Box>
            </Stack>
        </Box>

        {/* MAIN LAYOUT GRID */}
        <Grid container spacing={6}>
          
          {/* === LEFT COLUMN: Content === */}
          <Grid size={{xs: 12, md: 7}}> 
            
            {/* Quick Facts */}
            <Paper 
                elevation={0} 
                variant="outlined" 
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    borderRadius: 3, 
                    bgcolor: 'action.hover' 
                }}
            >
               <QuickFacts 
               // New Props
               durationValue={experience.durationValue} 
               durationUnit={experience.durationUnit}
               languages={experience.languages} // This is now a clean array ['en', 'fr']
    
               // Existing Props
               maxGuests={experience.maxGuests}
               startTimes={experience.startTimes}
               tourCode={experience.tourCode}
             />
            </Paper>

            {/* Description */}
            <Box sx={{
                mb: 4,
                color: 'text.secondary',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                '& p': { marginBottom: '1.5em' },
                '& strong': { fontWeight: 700, color: 'text.primary' },
                '& h3, & h4': { color: 'text.primary', fontWeight: 700, mt: 4, mb: 2 }
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {translation?.description || ''}
                </ReactMarkdown>
            </Box>

            {/* Highlights */}
            {highlightsContent && (
              <Box sx={{ mb: 6 }}>
                <Highlights highlights={highlightsContent} />
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* ITINERARY */}
            {translation?.program && translation.program.length > 0 ? (
                <ItineraryTimeline steps={translation.program} />
            ) : (
                <Itinerary itinerary={translation?.itinerary} />
            )}

            <Divider sx={{ my: 4 }} />

            {/* Inclusions */}
            <Inclusions
              included={translation?.included}
              notIncluded={translation?.notIncluded}
            />

            <Divider sx={{ my: 4 }} />

            {/* Map */}
            <Box sx={{ my: 4 }}>
               <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                 {t('mapTitle')}
               </Typography>
               <TourMap latitude={experience.latitude} longitude={experience.longitude} />
            </Box>
             
             {/* Provider Card (Now Localized internally) */}
             <ProviderCard />

            {/* FAQs */}
            {hasFaqs && (
              <Box sx={{ mt: 6 }}>
                 <Divider sx={{ mb: 6 }} />
                 <FAQAccordion faqs={faqsContent} />
              </Box>
            )}

            {/* Reviews */}
             {clientConfig?.hasReviewsSystem !== false && (
              <Box sx={{ mt: 8 }}>
                <Divider sx={{ mb: 6 }} />
                <ReviewsList experienceId={experience.id} />
                <Box sx={{ mt: 4 }}>
                   <LeaveReviewForm experienceId={experience.id} />
                </Box>
              </Box>
            )}
          </Grid>

          {/* === RIGHT COLUMN: Sticky Sidebar === */}
          <Grid size={{xs: 12, md: 5}}>
            <Box sx={{ position: { md: 'sticky' }, top: '100px', mb: 4 }}>
              
              <BookingForm
                  experienceId={experience.id}
                  experienceTitle={experienceTitle}
                  price={experience.price}
                  maxGuests={experience.maxGuests}
                  bookingPolicy={experience.bookingPolicy}
                  spotsLeft={spotsLeft} 
              />

              <Box sx={{ px: 1, mt: 3 }}>
                <HelpBox />
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Container>
      
      {/* SIMILAR TOURS */}
      <SimilarExperiences 
         currentExperienceId={experience.id} 
         locationId={experience.locationId} 
      />
      
      {/* 4. MOBILE BOTTOM BAR */}
      <MobileBookingBar 
        price={experience.price} 
        onBook={toggleBookingDrawer} 
      />

      {/* 5. MOBILE BOOKING DRAWER */}
      <Drawer
        anchor="bottom"
        open={isMobile && isBookingDrawerOpen}
        onClose={toggleBookingDrawer}
        PaperProps={{
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85vh' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={toggleBookingDrawer}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ px: 2, pb: 4 }}>
            <BookingForm
                experienceId={experience.id}
                experienceTitle={experienceTitle}
                price={experience.price}
                maxGuests={experience.maxGuests}
                bookingPolicy={experience.bookingPolicy}
                isMobileModal={true} 
            />
        </Box>
      </Drawer>

    </Box>
  );
}