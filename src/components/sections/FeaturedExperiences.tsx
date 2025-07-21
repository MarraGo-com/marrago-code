// /src/components/sections/FeaturedExperiences.tsx
'use client';

import React from 'react';
import { Grid, CircularProgress, Alert, Box, Container } from '@mui/material';
import ExperienceCard from '@/components/ui/ExperienceCard';
import { useExperiences } from '@/hooks/useExperiences';
import { useTranslations, useLocale } from 'next-intl'; // <-- 1. IMPORT useLocale
import MainHeading from '../custom/MainHeading';
import { Experience } from '@/types/experience';

export default function FeaturedExperiences() {
  const t = useTranslations('FeaturedExperiences');
  const locale = useLocale(); // <-- 2. GET THE CURRENT LOCALE ('en' or 'fr')
  const { data: experiences, isLoading, isError, error } = useExperiences();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <MainHeading 
          titleKey='title' 
          t={t} 
          variant="h2" 
          component="h2" 
          sx={{ textAlign: 'center', fontWeight: 'bold', mb: 8, color: 'text.primary' }}
         />
        
        {isLoading && ( <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> )}
        {isError && ( <Alert severity="error" sx={{ maxWidth: 'md', mx: 'auto' }}>{error ? error.message : t('genericError')}</Alert> )}

        {experiences && (
  <Grid container spacing={4}>
    {experiences.map((exp: Experience) => {
      const translation = exp.translations?.[locale] || exp.translations?.en;
      const title = translation?.title || 'Title not available';
      const description = translation?.description || 'Description not available.';

      return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={exp.id}>
          <ExperienceCard
            id={exp.id}
            title={title}
            description={description}
            coverImage={exp.coverImage}
            // --- PASS THE CORRECT PROPS ---
            price={exp.price} 
            locationId={exp.locationId}
          />
        </Grid>
      );
    })}
  </Grid>
)}
      </Container>
    </Box>
  );
}