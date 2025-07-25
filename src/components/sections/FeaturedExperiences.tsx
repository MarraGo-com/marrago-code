// /src/components/sections/FeaturedExperiences.tsx
'use client';

import React from 'react';
import { Grid, CircularProgress, Alert, Box, Container } from '@mui/material';
import ExperienceCard from '@/components/ui/ExperienceCard';
import { useExperiences } from '@/hooks/useExperiences';
import { useTranslations } from 'next-intl';
import MainHeading from '../custom/MainHeading';
import { Experience } from '@/types/experience';

export default function FeaturedExperiences() {
  const t = useTranslations('FeaturedExperiences');
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
      // Removed unused variables title and description

      return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={exp.id}>
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