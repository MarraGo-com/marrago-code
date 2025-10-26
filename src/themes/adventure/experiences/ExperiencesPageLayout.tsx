// /src/themes/adventure/experiences/ExperiencesPageLayout.tsx (UPDATED)
'use client';

import React from 'react';
import { Grid, Box, Typography, Container, CircularProgress, Alert, SelectChangeEvent } from "@mui/material";
// Kept for UI-specific text like the 'noResults' message
import { useTranslations } from 'next-intl';
// NEW: Import client data and locale hook for main content
import { useLocale } from 'next-intl';

import { Experience } from '@/types/experience';
import dynamic from "next/dynamic";
// UPDATED: Use MainHeadingUserContent for direct title prop
import { ExperienceCardProps } from '../../default/cards/ExperienceCard';
import { FilterControlsProps } from './FilterControls';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { siteConfig } from '@/config/client-data';

// Dynamically import the adventure theme's components
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ExperienceCard = dynamic<ExperienceCardProps>(() => import(`@/themes/${theme}/cards/ExperienceCard`));
const FilterControls = dynamic<FilterControlsProps>(() => import(`@/themes/${theme}/experiences/FilterControls`));

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
  // `t` is still used for the 'noResults' message
  const t = useTranslations('ExperiencesPage');

  // NEW: Get content for title and subtitle
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.experiencesPage || siteConfig.textContent.en.experiencesPage;

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          {/* UPDATED: MainHeadingUserContent now gets title from client data */}
          <MainHeadingUserContent 
            title={content.title}
            sx={{ 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              mb: 2 
            }} 
          />
          {/* UPDATED: Typography now gets subtitle from client data */}
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.subtitle}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 10 }}>
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
              <Grid size={{xs: 12, sm: 6, md: 4}} key={exp.id}>
                <ExperienceCard experience={exp}/>
              </Grid>
            ))}
          </Grid>
        )}

        {processedExperiences && processedExperiences.length === 0 && !isLoading && (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', mt: 8 }}>
            {t('noResults')}
          </Typography>
        )}
      </Container>
    </Box>
  );
}