'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface HighlightsProps {
  highlights: string | string[]; // <--- ALLOW BOTH TYPES
}

export default function Highlights({ highlights }: HighlightsProps) {
  
  // ROBUST PARSING: Handle Array (New Data) OR String (Old Data)
  let highlightItems: string[] = [];

  if (Array.isArray(highlights)) {
    // It's already an array (New Seed Data)
    highlightItems = highlights;
  } else if (typeof highlights === 'string') {
    // It's a string (Old/Manual Data) -> Split by new line
    highlightItems = highlights.split('\n').filter(item => item.trim() !== '');
  }

  // Safety check: If empty, don't render
  if (!highlightItems || highlightItems.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Highlights
      </Typography>
      <Stack spacing={1.5}>
        {highlightItems.map((item, index) => (
          <Stack key={index} direction="row" alignItems="flex-start" spacing={1.5}>
             <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, mt: 0.3 }} />
             <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
               {item}
             </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}