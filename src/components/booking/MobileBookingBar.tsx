'use client';

import React from 'react';
import { Box, Button, Typography, Paper, Slide, useMediaQuery, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

interface MobileBookingBarProps {
  price: { 
    amount: number; 
    currency: string; 
    prefix: string; 
  };
  onBook: () => void;
  isVisible?: boolean;
}

export default function MobileBookingBar({ price, onBook, isVisible = true }: MobileBookingBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Using the new keys we defined
  const t = useTranslations('ExperienceDetails');

  if (!isMobile) return null;

  return (
    <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
      <Paper 
        elevation={4}
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1200, 
          borderRadius: '16px 16px 0 0',
          borderTop: '1px solid',
          borderColor: 'divider',
          // Dark Mode Fix: Use theme paper instead of white
          bgcolor: 'background.paper' 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: 2,
          pb: 'max(16px, env(safe-area-inset-bottom))'
        }}>
          
          {/* PRICE DISPLAY */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {t('stickyHeader.from')}
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {price.prefix} {price.amount} {price.currency}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
               {t('mobileBar.perPerson')}
            </Typography>
          </Box>

          {/* CTA BUTTON */}
          <Button 
            variant="contained" 
            onClick={onBook}
            disableElevation
            sx={{ 
              borderRadius: 50,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              px: 4,
              py: 1.5,
              boxShadow: theme.shadows[3]
            }}
          >
            {t('mobileBar.checkAvailability')}
          </Button>

        </Box>
      </Paper>
    </Slide>
  );
}