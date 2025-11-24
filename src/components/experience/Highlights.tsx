// /src/components/experience/Highlights.tsx
'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';
// ▼▼▼ NEW IMPORT ▼▼▼
import { useTranslations } from 'next-intl';

interface HighlightsProps {
  highlights?: string; // This will hold the raw Markdown string
}

// Helper function to clean Markdown list items
const cleanListItem = (item: string) => {
    return item.replace(/^[\*\-\•]\s*/, '');
};

export default function Highlights({ highlights }: HighlightsProps) {
  const theme = useTheme();
  // ▼▼▼ GET TRANSLATIONS ▼▼▼
  const t = useTranslations('ExperienceDetailsNew');

  // 1. Split the string into an array based on new lines
  // 2. Filter out any empty lines
  const highlightItems = highlights?.split('\n').filter(item => item.trim() !== '') || [];

  // If no highlights exist, don't render anything
  if (highlightItems.length === 0) {
    return null;
  }

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        {/* ▼▼▼ TRANSLATED ▼▼▼ */}
        {t('highlightsTitle')}
      </Typography>
      
      <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <List disablePadding>
            {highlightItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 2, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: '40px', mt: 0.5, color: theme.palette.primary.main }}>
                    <StarIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                    primary={cleanListItem(item)}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: 'text.primary'
                    }}
                    sx={{ m: 0 }}
                />
            </ListItem>
            ))}
        </List>
      </Paper>
    </Box>
  );
}