// /src/themes/luxury/experiences/FilterControls.tsx
'use client';

import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';
import { locations } from '@/config/locations';

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
  onSortChange,
}: FilterControlsProps) {
  const t = useTranslations('FilterControls');

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '700px', mx: 'auto' }}>
      <Grid  size={{xs: 12, sm: 6}}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>{t('locationLabel')}</InputLabel>
          <Select value={selectedLocation} onChange={onLocationChange} label={t('locationLabel')}>
            <MenuItem value="all">{t('allLocations')}</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{xs: 12, sm: 6}}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>{t('sortLabel')}</InputLabel>
          <Select value={selectedSort} onChange={onSortChange} label={t('sortLabel')}>
            <MenuItem value="default">{t('sortDefault')}</MenuItem>
            <MenuItem value="price_asc">{t('sortPriceAsc')}</MenuItem>
            <MenuItem value="price_desc">{t('sortPriceDesc')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}