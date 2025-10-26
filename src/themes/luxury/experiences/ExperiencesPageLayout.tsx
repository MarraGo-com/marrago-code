// -------------------------------------------------------------------------
// UPDATED FILE: /src/themes/[theme]/experiences/ExperiencesPageLayout.tsx
// -------------------------------------------------------------------------
'use client'; // <-- 1. MUST be a client component

import React, { useState, useMemo, useEffect, useCallback } from 'react'; // 2. Import hooks
import { Grid, Box, Typography, Container, CircularProgress, Alert, SelectChangeEvent } from "@mui/material";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

// --- ▼▼▼ LOGIC MOVED FROM ExperiencesClient ▼▼▼ ---
import { useSearchParams } from 'next/navigation';
import { useExperiences } from '@/hooks/useExperiences';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Experience } from '@/types/experience';
import { siteConfig } from '@/config/client-data';
// --- ▲▲▲ END OF MOVED LOGIC ▲▲▲ ---

import dynamic from "next/dynamic";
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';

// Dynamically import theme components
const ExperienceCard = dynamic(() => import(`@/themes/luxury/cards/ExperienceCard`));
const FilterControls = dynamic(() => import(`@/themes/luxury/experiences/FilterControls`));

// 3. REMOVED all props. The component is now self-sufficient.
export default function ExperiencesPageLayout() {
  
  // --- ▼▼▼ ALL LOGIC FROM ExperiencesClient IS NOW HERE ▼▼▼ ---
  const { data: allExperiences, isLoading, isError } = useExperiences();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'default');
  
  useEffect(() => {
    setSelectedLocation(searchParams.get('location') || 'all');
    setSortOption(searchParams.get('sort') || 'default');
  }, [searchParams]);

  const updateUrlParams = useCallback((newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [key, value] of Object.entries(newParams)) {
      if (value === 'all' || value === 'default' || !value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`);
  }, [searchParams, pathname, router]);

  const handleLocationChange = (event: SelectChangeEvent) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);
    updateUrlParams({ location: newLocation, sort: sortOption });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const newSort = event.target.value;
    setSortOption(newSort);
    updateUrlParams({ location: selectedLocation, sort: newSort });
  };

  const processedExperiences = useMemo(() => {
    if (!allExperiences) return [];
    let experiences = [...allExperiences];
    if (selectedLocation !== 'all') {
      experiences = experiences.filter((exp: Experience) => exp.locationId === selectedLocation);
    }
    if (sortOption === 'price_asc') {
      experiences.sort((a: Experience, b: Experience) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortOption === 'price_desc') {
      experiences.sort((a: Experience, b: Experience) => (b.price?.amount || 0) - (a.price?.amount || 0));
    }
    return experiences;
  }, [allExperiences, selectedLocation, sortOption]);
  
  const t = useTranslations('ExperiencesPage');
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.experiencesPage || siteConfig.textContent.en.experiencesPage;
  // --- ▲▲▲ END OF LOGIC ▲▲▲ ---

  // 4. The JSX/UI remains exactly the same, using the local state and data
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeadingUserContent 
            title={content.title}
            sx={{ fontWeight: 400, mb: 2 }} 
          />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.subtitle}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 10 }}>
          <FilterControls 
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            selectedSort={sortOption}
            onSortChange={handleSortChange}
          />
        </Box>

        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
        {isError && <Alert severity="error">Failed to load experiences.</Alert>}
        
        {processedExperiences && (
          <Grid container spacing={{ xs: 5, md: 8 }}>
            {processedExperiences.map((exp: Experience) => (
              <Grid  key={exp.id}  size= {{ xs: 12, sm: 6, md: 4 }}>
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