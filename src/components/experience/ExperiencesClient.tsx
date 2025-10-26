// /src/components/experience/ExperiencesClient.tsx
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SelectChangeEvent } from "@mui/material";
import { useExperiences } from '@/hooks/useExperiences';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Experience } from '@/types/experience';
import dynamic from "next/dynamic";
import { ExperiencesPageLayoutProps } from '@/themes/default/experiences/ExperiencesPageLayout';
import { siteConfig } from '@/config/client-data';

// --- DYNAMICALLY IMPORT THE CORRECT LAYOUT COMPONENT ---
const theme = siteConfig.templateTheme || 'default';
// const ExperiencesPageLayout = dynamic(() => import(`@/themes/${theme}/experiences/ExperiencesPageLayout`));

// --- EDIT 2: Apply the type to your dynamic component ---
const ExperiencesPageLayout = dynamic<ExperiencesPageLayoutProps>(() => 
  import(`@/themes/${theme}/experiences/ExperiencesPageLayout`)
);

export default function ExperiencesClient() {
  // --- All of your "Engine" logic remains here, untouched ---
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

  // The component now passes all data and functions down to the dynamic layout
  return (
    <>
      <ExperiencesPageLayout 
      processedExperiences={processedExperiences}
      isLoading={isLoading}
      isError={isError}
      selectedLocation={selectedLocation}
      onLocationChange={handleLocationChange}
      selectedSort={sortOption}
      onSortChange={handleSortChange}
    />
    </>
  );
}