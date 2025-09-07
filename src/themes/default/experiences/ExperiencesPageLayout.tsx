// /src/themes/default/experiences/ExperiencesPageLayout.tsx
'use client';

import React from 'react';
import { Grid, Box, Typography, Container, CircularProgress, Alert, SelectChangeEvent } from "@mui/material";
import { useTranslations } from 'next-intl';
import { Experience } from '@/types/experience';
import dynamic from "next/dynamic";
import { MainHeadingProps } from '../custom/MainHeading';
import { ExperienceCardProps } from '../cards/ExperienceCard';

// These components are now also part of the theme's layout
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const MainHeading = dynamic<MainHeadingProps>(() => import(`@/themes/${theme}/custom/MainHeading`));
const ExperienceCard = dynamic<ExperienceCardProps>(() => import(`@/themes/${theme}/cards/ExperienceCard`));
const FilterControls = dynamic(() => import(`@/components/experience/FilterControls`)); // Assuming filters are shared for now

// This component is "dumb". It only receives data and functions as props.
export interface ExperiencesPageLayoutProps {
  processedExperiences: Experience[];
  isLoading: boolean;
  isError: boolean;
  selectedLocation: string;
  onLocationChange: (event: SelectChangeEvent) => void;
  selectedSort: string;
  onSortChange: (event: SelectChangeEvent) => void;
}

export default function ExperiencesPageLayout({
  processedExperiences,
  isLoading,
  isError,
  selectedLocation,
  onLocationChange,
  selectedSort,
  onSortChange
}: ExperiencesPageLayoutProps) {
  const t = useTranslations('ExperiencesPage');

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <main className="flex-grow">
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <MainHeading titleKey='title' t={t} sx={{ fontWeight: 'bold', mb: 2 }} />
            <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>{t('subtitle')}</Typography>
          </Box>
          
          <Box sx={{ mb: 6 }}>
            <FilterControls 
              selectedLocation={selectedLocation}
              onLocationChange={onLocationChange}
              selectedSort={selectedSort}
              onSortChange={onSortChange}
            />
          </Box>

          {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
          {isError && <Alert severity="error">Failed to load experiences.</Alert>}
          
          {processedExperiences && (
            <Grid container spacing={4}>
              {processedExperiences.map((exp: Experience) => (
                <Grid  size={{xs: 12, sm: 6, md: 4}} key={exp.id}>
                  <ExperienceCard experience={exp}/>
                </Grid>
              ))}
            </Grid>
          )}

          {processedExperiences && processedExperiences.length === 0 && !isLoading && (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', mt: 8 }}>{t('noResults')}</Typography>
          )}
        </Container>
      </main>
    </Box>
  );
}