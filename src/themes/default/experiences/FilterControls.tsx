// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/components/experience/FilterControls.tsx
// This component now includes controls for both location and sorting.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import {Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';


// The props are updated to handle both location and sort changes
import type { SelectChangeEvent } from '@mui/material';
import { locations } from '@/config/locations';

// The props are now correctly typed to match the parent component's handlers.
interface FilterControlsProps {
  selectedLocation: string;
  onLocationChange: (event: SelectChangeEvent) => void;
  selectedSort: string;
  onSortChange: (event: SelectChangeEvent) => void;
}

export default function FilterControls({ 
  selectedLocation, 
  onLocationChange, 
  selectedSort, 
  onSortChange 
}: FilterControlsProps) {
  const t = useTranslations('ExperienceFilters');

  return (
    // Use a Grid container to lay out the filters neatly
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="location-filter-label">{t('locationLabel')}</InputLabel>
          <Select
            labelId="location-filter-label"
            value={selectedLocation}
            label={t('locationLabel')}
            onChange={onLocationChange}
          >
            <MenuItem value="all">
              <em>{t('allLocations')}</em>
            </MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="sort-by-label">{t('sortLabel')}</InputLabel>
          <Select
            labelId="sort-by-label"
            value={selectedSort}
            label={t('sortLabel')}
            onChange={onSortChange}
          >
            <MenuItem value="default"><em>{t('sortDefault')}</em></MenuItem>
            <MenuItem value="price_asc">{t('sortPriceAsc')}</MenuItem>
            <MenuItem value="price_desc">{t('sortPriceDesc')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}