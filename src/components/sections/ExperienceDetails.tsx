// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/components/sections/ExperienceDetails.tsx
// This is the main component that orchestrates the new layout.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import our new sub-components
import StickyBookingWidget from '@/components/booking/StickyBookingWidget';
import Inclusions from '@/components/experience/Inclusions';
import Itinerary from '@/components/experience/Itinerary';
import ImageGallery from '../experience/ImageGallery';
import ResponsiveHeading from '../custom/ResponsiveHeading';
import { Experience } from '@/types/experience';
import { locations } from '@/config/locations';

// This is the full, detailed interface for an experience object


 /* interface ExperienceDetailsProps {
  experience: Experience | undefined;
}  */

export default function ExperienceDetails( {experience}: { experience: Experience }) {
  const locale = useLocale();
  const t = useTranslations('ExperienceDetails');
  
  // Get the correct translation object, falling back to English
  const translation = experience.translations?.[locale] || experience.translations?.en;
  const location = locations.find(loc => loc.id === experience.locationId);

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }} >
          <ResponsiveHeading   sx={{ fontWeight: 'bold' }}>
            {translation?.title || experience.title} {/* Use translated title */}
          </ResponsiveHeading>
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
          {/* ✅ **FIX**: Corrected Grid prop from 'size' to 'item xs/md' */}
          <Grid   size={{ xs: 12, md: 7 }}>
             <ImageGallery 
               coverImage={experience.coverImage}
               // ✅ **FIX**: Passed the actual gallery images, with a fallback to an empty array
               galleryImages={experience.galleryImages || []}
               altText={translation?.title || experience.title || ''}
             />
            
             <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
               {translation?.description || experience.description} {/* Use translated description */}
             </Typography>

             <Divider sx={{ my: 4 }} />

             <Inclusions 
               included={translation?.included}
               notIncluded={translation?.notIncluded}
             />

             <Itinerary itinerary={translation?.itinerary} />

             {/* Important Info Section (only renders if content exists) */}
             {translation?.importantInfo && (
               <>
                 <Divider sx={{ my: 4 }} />
                 <Box>
                   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>{t('importantInfoTitle')}</Typography>
                   <Box sx={{ '& h2, & h3': { my: 2 }, '& p, & ul, & li': { color: 'text.secondary' } }}>
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{translation.importantInfo}</ReactMarkdown>
                   </Box>
                 </Box>
               </>
             )}
           </Grid>

          {/* Right Column: Sticky Booking Widget */}
          {/* ✅ **FIX**: Corrected Grid prop from 'size' to 'item xs/md' */}
          <Grid size={{ xs: 12, md: 5 }} alignSelf="flex-start">
            {/* ✅ CORRECTED CODE: Wrap the widget in a Box with sticky styles */}
            <Box sx={{ 
              position: 'sticky', 
              top: '80px', // Sticks 80px from the top. Adjust as needed for your header.
              alignSelf: 'flex-start' // Crucial for sticky within a flex container.
            }}>
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