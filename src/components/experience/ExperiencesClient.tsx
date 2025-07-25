// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/experiences/page.tsx
// This page now correctly syncs its state with the URL search parameters.
// -------------------------------------------------------------------------
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {Grid, Box, Typography, Container, CircularProgress, Alert, SelectChangeEvent } from "@mui/material";
// import Header from "@/components/ui/Header";
// import Footer from "@/components/ui/Footer";
import ExperienceCard from "@/components/ui/ExperienceCard";
import FilterControls from '@/components/experience/FilterControls';
import { useTranslations } from 'next-intl';
import { useExperiences } from '@/hooks/useExperiences';
import { usePathname, useRouter } from '@/i18n/navigation';
import MainHeading from '@/components/custom/MainHeading';
import { Experience } from '@/types/experience';



  

export default function ExperiencesComponent() {
  const t = useTranslations('ExperiencesPage');
  const { data: allExperiences, isLoading, isError } = useExperiences();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL search params
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'default');

  // --- THIS IS THE KEY FIX ---
  // This useEffect hook listens for changes to the searchParams object.
  // When the URL changes (e.g., from the header dropdown), this hook will run
  // and update our component's state to match the new URL parameters.
  useEffect(() => {
    setSelectedLocation(searchParams.get('location') || 'all');
    setSortOption(searchParams.get('sort') || 'default');
  }, [searchParams]);

  // This function builds the new URL and pushes it to the router
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
    // We use router.replace instead of push to avoid cluttering the browser history
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* <Header /> */}
      <main className="flex-grow">
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <MainHeading titleKey='title' t={t} sx={{ fontWeight: 'bold', mb: 2 }} />
            <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>{t('subtitle')}</Typography>
          </Box>
          
          <Box sx={{ mb: 6 }}>
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
            <Grid container spacing={4}>
              {processedExperiences.map((exp: Experience) => {
                return (
                  <Grid key={exp.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ExperienceCard experience={exp}/>
                  </Grid>
                );
              })}
            </Grid>
          )}

           {processedExperiences && processedExperiences.length === 0 && !isLoading && (
             <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', mt: 8 }}>{t('noResults')}</Typography>
           )}
        </Container>
      </main>
      {/* <Footer /> */}
    </Box>
  );
}