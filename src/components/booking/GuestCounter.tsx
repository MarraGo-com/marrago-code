// /src/components/booking/GuestCounter.tsx
'use client';

import React from 'react';
import { Stack, Typography, IconButton, Box, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface GuestCounterProps {
  label: string;
  subLabel?: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export default function GuestCounter({ 
  label, 
  subLabel, 
  value, 
  onChange, 
  min = 0, 
  max = 20 
}: GuestCounterProps) {
  const theme = useTheme();

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
      {/* Label Section */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {label}
        </Typography>
        {subLabel && (
          <Typography variant="caption" color="text.secondary">
            {subLabel}
          </Typography>
        )}
      </Box>

      {/* Counter Section */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton 
          onClick={handleDecrement} 
          disabled={value <= min}
          size="small"
          sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.primary.main,
            '&:disabled': { opacity: 0.3 }
           }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        
        <Typography variant="h6" sx={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
          {value}
        </Typography>

        <IconButton 
          onClick={handleIncrement} 
          disabled={value >= max}
          size="small"
          sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': { bgcolor: theme.palette.primary.dark },
            '&:disabled': { opacity: 0.3, bgcolor: theme.palette.action.disabledBackground }
           }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}