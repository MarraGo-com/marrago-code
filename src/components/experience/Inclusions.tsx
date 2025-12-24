'use client';

import React from 'react';
import { Box, Typography, Grid, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl'; // <--- 1. Import Hook

interface InclusionsProps {
  included?: string | string[];    
  notIncluded?: string | string[]; 
}

// Helper to safely parse string OR array
const parseList = (items: string | string[] | undefined): string[] => {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  return items.split('\n').filter(item => item.trim() !== '');
};

export default function Inclusions({ included, notIncluded }: InclusionsProps) {
  // 2. Initialize Translations
  const t = useTranslations('ExperienceDetails');

  // 1. Safe Parsing
  const includedItems = parseList(included);
  const notIncludedItems = parseList(notIncluded);

  // 2. Hide if empty
  if (includedItems.length === 0 && notIncludedItems.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4, py: 4, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        {t('inclusionsTitle')} {/* <--- 3. Use Dynamic Key */}
      </Typography>
      
      <Grid container spacing={4}>
        
        {/* INCLUDED COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
                {includedItems.map((item, index) => (
                    <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                        <CheckIcon color="success" sx={{ fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body1">{item}</Typography>
                    </Stack>
                ))}
            </Stack>
        </Grid>

        {/* NOT INCLUDED COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
                {notIncludedItems.map((item, index) => (
                    <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                        <CloseIcon color="error" sx={{ fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            {item}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Grid>

      </Grid>
    </Box>
  );
}