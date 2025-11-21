// /src/components/experience/Itinerary.tsx
'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ItineraryProps {
  itinerary?: string;
}

export default function Itinerary({ itinerary }: ItineraryProps) {
  const t = useTranslations('ExperienceDetails');

  // If there's no itinerary content, don't render anything
  if (!itinerary || itinerary.trim() === '') {
    return null;
  }

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        {t('itineraryTitle')}
      </Typography>
      
      {/* ▼▼▼ FIX: Simplified rendering using just ReactMarkdown ▼▼▼ */}
      <Box sx={{
          lineHeight: 1.7,
          color: 'text.secondary',
          fontSize: '1.1rem',
          '& p': { mb: 2 },
          // Style numbered and bulleted lists
          '& ol, & ul': { pl: 4, mb: 3 },
          '& li': { mb: 1.5, paddingLeft: 1 },
          // Style bold text (like the times in your itinerary)
          '& strong': { fontWeight: 700, color: 'text.primary' }
        }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {itinerary}
        </ReactMarkdown>
      </Box>
      {/* ▲▲▲ FIX END ▲▲▲ */}

    </Box>
  );
}