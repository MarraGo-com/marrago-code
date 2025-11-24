// /src/themes/adventure/sections/FeaturedExperiences.tsx
'use client';

import React from 'react';
import { Grid, CircularProgress, Alert, Box, Container } from '@mui/material';
import { useExperiences } from '@/hooks/useExperiences';
import { useLocale, useTranslations } from 'next-intl';
// import MainHeading from '../../default/custom/MainHeading';

import { Experience } from '@/types/experience';
import dynamic from 'next/dynamic';
import { ExperienceCardProps } from '../../default/cards/ExperienceCard';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { HomepageContent } from '@/config/types';
import { siteConfig } from '@/config/client-data';

// This will dynamically load your default card, which is perfect.
const ExperienceCard = dynamic<ExperienceCardProps>(() => import(`@/themes/adventure/cards/ExperienceCard`));

export default function FeaturedExperiences() {
  const t = useTranslations('FeaturedExperiences');
    const locale = useLocale() as 'en' | 'fr' | 'ar'; 
  
    // NEW: Safely get homepage content for the current locale
    const homepageContent: HomepageContent = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;
  const { data: experiences, isLoading, isError, error } = useExperiences();

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress /></Box>;
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Alert severity="error" sx={{ maxWidth: 'md', mx: 'auto' }}>
          {error ? error.message : t('genericError')}
        </Alert>
      </Container>
    );
  }
  
  if (!experiences || experiences.length === 0) {
    return null; // Don't render if no experiences
  }

  // --- THIS IS THE KEY CHANGE: A dynamic, asymmetrical layout ---
  const mainExperience = experiences[0];
  const secondaryExperiences = experiences.slice(1, 3);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <MainHeadingUserContent
          title={homepageContent.featuredExperiencesTitle}
          variant="h2" 
          component="h2" 
          sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', // Bold, uppercase heading
            mb: 8, 
            color: 'text.primary' 
          }}
        />
        
        <Grid container spacing={4} alignItems="stretch">
            {/* Main Featured Experience (takes up half the space) */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: '100%' }}>
                    <ExperienceCard experience={mainExperience} />
                </Box>
            </Grid>

            {/* Secondary Experiences (stacked on the other half) */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {secondaryExperiences.map((exp: Experience) => (
                        <Box key={exp.id} sx={{ flex: 1 }}>
                           <ExperienceCard experience={exp} />
                        </Box>
                    ))}
                </Box>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}