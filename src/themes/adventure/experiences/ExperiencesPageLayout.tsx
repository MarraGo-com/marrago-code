// /src/themes/adventure/experiences/ExperiencesPageLayout.tsx (UPDATED)
'use client';

import React, { useMemo, useState } from 'react';
import { Grid, Box, Typography, Container, CircularProgress, SelectChangeEvent } from "@mui/material";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import dynamic from "next/dynamic";
import { Experience } from '@/types/experience';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { siteConfig } from '@/config/client-data';
import { useExperiences } from '@/hooks/useExperiences';

// Dynamically import the adventure theme's components
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ExperienceCard = dynamic(
  () => import(`@/themes/${theme}/cards/ExperienceCard`) as Promise<{ default: React.ComponentType<{ experience: Experience }> }>
);

type FilterControlsProps = {
  selectedLocation: string;
  onLocationChange: (event: SelectChangeEvent) => void;
  selectedSort: string;
  onSortChange: (event: SelectChangeEvent) => void;
};

// Cast the dynamic import so TypeScript knows the component prop types
const FilterControls = dynamic(
  () => import(`@/themes/${theme}/experiences/FilterControls`) as Promise<{ default: React.ComponentType<FilterControlsProps> }>
);

export default function ExperiencesPageLayout() {
  const t = useTranslations('ExperiencesPage');

  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.experiencesPage || siteConfig.textContent.en.experiencesPage;

  // Use the hook to fetch experiences on the client
  const { data: experiences, isLoading } = useExperiences();

  // Local UI state for filters/sorting
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('default');

  const onLocationChange = (event: SelectChangeEvent) => setSelectedLocation(event.target.value as string);
  const onSortChange = (event: SelectChangeEvent) => setSelectedSort(event.target.value as string);

  // Compute filtered + sorted experiences
  const processedExperiences: Experience[] = useMemo(() => {
    if (!experiences || !Array.isArray(experiences)) return [];

    let items = experiences as Experience[];

    if (selectedLocation && selectedLocation !== 'all') {
      items = items.filter((e) => e.locationId === selectedLocation);
    }

    if (selectedSort === 'price_asc') {
      items = items.slice().sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (selectedSort === 'price_desc') {
      items = items.slice().sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    }

    return items;
  }, [experiences, selectedLocation, selectedSort]);

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeadingUserContent 
            title={content.title}
            sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2 }}
          />
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
        {processedExperiences && (
          <Grid container spacing={4}>
            {processedExperiences.map((exp: Experience) => (
              <Grid key={exp.id } size={{ xs: 12, sm: 6, md: 4 } }>
                <ExperienceCard experience={exp} />
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