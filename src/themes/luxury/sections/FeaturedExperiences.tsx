// /src/themes/luxury/sections/FeaturedExperiences.tsx
'use client';

import React from 'react';
import { Grid, CircularProgress, Alert, Box, Container } from '@mui/material';
import { useExperiences } from '@/hooks/useExperiences';
import { useLocale, useTranslations } from 'next-intl';
// import MainHeading from '../../default/custom/MainHeading'; // We can reuse the heading component for now

import { Experience } from '@/types/experience';
import dynamic from 'next/dynamic';
import { ExperienceCardProps } from '../cards/ExperienceCard';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { HomepageContent } from '@/config/types';
import { siteConfig } from '@/config/client-data';

// This dynamic import will now correctly load your new luxury card
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ExperienceCard = dynamic<ExperienceCardProps>(() => import(`@/themes/${theme}/cards/ExperienceCard`));

export default function FeaturedExperiences() {
  const t = useTranslations('FeaturedExperiences');
  const { data: experiences, isLoading, isError, error } = useExperiences();
// CHANGED: Use useLocale to get the current locale
  const locale = useLocale() as 'en' | 'fr' | 'ar'; 

  // NEW: Safely get homepage content for the current locale
  const homepageContent: HomepageContent = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;
  return (
    // Use a clean, default background for a more minimalist feel
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <MainHeadingUserContent
          title={homepageContent.featuredExperiencesTitle} 
          variant="h2" 
          component="h2" 
          sx={{ 
            textAlign: 'center', 
            // --- THIS IS THE KEY CHANGE ---
            // Use the elegant 'lora' font and a lighter weight for a luxury feel
           // fontFamily: 'lora, serif',
            fontWeight: 500,
            mb: 10, // Increased margin for more vertical space
            color: 'text.primary' 
          }}
         />
        
        {isLoading && ( <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> )}
        {isError && ( <Alert severity="error" sx={{ maxWidth: 'md', mx: 'auto' }}>{error ? error.message : t('genericError')}</Alert> )}

        {experiences && (
          // Increased spacing between cards for a less cluttered, more premium layout
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {experiences.slice(0, 3).map((exp: Experience) => { // Show only 3 featured items for a more curated feel
              return (
                <Grid  key={exp.id} size={{xs: 12, sm: 6, md: 4}}>
                  <ExperienceCard experience={exp}/>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}