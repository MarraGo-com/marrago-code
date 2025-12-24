'use client';

import React from 'react';
import { 
  Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, 
  Radio, RadioGroup, Divider, Stack 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import { useTranslations } from 'next-intl';

export interface FilterSidebarProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  minPrice: number;
  maxPrice: number;
  
  minRating: number | null;
  setMinRating: (value: number | null) => void;

  features: {
    freeCancellation: boolean;
    likelyToSellOut: boolean;
    mobileTicket: boolean;
  };
  setFeatures: (value: any) => void;
}

export default function FilterSidebar({
  priceRange, setPriceRange, minPrice, maxPrice,
  minRating, setMinRating,
  features, setFeatures
}: FilterSidebarProps) {
  const t = useTranslations('ExperiencesPage.filters');

  const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeatures({ ...features, [event.target.name]: event.target.checked });
  };

  return (
    <Box sx={{ width: '100%' }}>
      
      {/* 1. PRICE FILTER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {t('priceRange')}
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={minPrice}
          max={maxPrice}
          sx={{ color: 'primary.main', mb: 1 }}
        />
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">€{priceRange[0]}</Typography>
            <Typography variant="caption" color="text.secondary">€{priceRange[1]}</Typography>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 2. RATING FILTER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {t('guestRating')}
        </Typography>
        <RadioGroup
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          {[4.5, 4, 3].map((val) => (
            <FormControlLabel 
              key={val} 
              value={val} 
              control={<Radio size="small" />} 
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="body2">{val}+</Typography>
                    <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                </Stack>
              } 
            />
          ))}
          <FormControlLabel 
             value={0} 
             control={<Radio size="small" />} 
             label={<Typography variant="body2">{t('anyRating')}</Typography>} 
          />
        </RadioGroup>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 3. FEATURES FILTER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {t('features')}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={features.freeCancellation} onChange={handleFeatureChange} name="freeCancellation" size="small" />}
            label={<Typography variant="body2">{t('freeCancellation')}</Typography>}
          />
          <FormControlLabel
            control={<Checkbox checked={features.likelyToSellOut} onChange={handleFeatureChange} name="likelyToSellOut" size="small" />}
            label={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">{t('likelyToSellOut')}</Typography>
                    <BoltIcon sx={{ fontSize: 16, color: '#e11d48' }} />
                </Stack>
            }
          />
           <FormControlLabel
            control={<Checkbox checked={features.mobileTicket} onChange={handleFeatureChange} name="mobileTicket" size="small" />}
            label={<Typography variant="body2">{t('mobileTicket')}</Typography>}
          />
        </FormGroup>
      </Box>

    </Box>
  );
}