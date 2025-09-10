// /src/themes/luxury/ui/TopHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, Button, Divider, useTheme, IconButton, Tooltip } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

// Import the new icons
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function TopHeader({ textColor }: { textColor: string }) {
  const t = useTranslations('TopHeader');
  const theme = useTheme();
  
  // --- THIS IS THE KEY CHANGE ---
  // Define a smaller font size for all text elements
  const smallFontSize = '0.75rem'; // Equivalent to 12px

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'flex-end',
        alignItems: 'center',
        py: 0.25, // Reduced vertical padding
        borderBottom: 1,
        borderColor: textColor === 'common.white' ? 'rgba(255, 255, 255, 0.2)' : 'divider',
        transition: 'border-color 0.3s ease-in-out',
        gap: theme.spacing(2), // Reduced gap between items
      }}
    >
      {/* Help link with smaller icon and text */}
      <Link href="/contact" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <HeadsetMicIcon sx={{ color: textColor, fontSize: '1rem', mr: 0.5 }} />
        <Typography variant="body2" sx={{ color: textColor, '&:hover': { opacity: 0.8 }, textTransform: 'uppercase', fontSize: smallFontSize }}>
          {t('help')}
        </Typography>
      </Link>

      <LanguageSwitcher textColor={textColor} fontSize={smallFontSize} />
      
      {/* Icon-Only Buttons with smaller size */}
      <Tooltip title={t('findReservationTooltip')}>
        <IconButton color="inherit" sx={{ p: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: '1.25rem', color: textColor }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title={t('cartTooltip')}>
        <IconButton color="inherit" sx={{ p: 0.5 }}>
            <ShoppingCartIcon sx={{ fontSize: '1.25rem', color: textColor }} />
        </IconButton>
      </Tooltip>


      <Divider orientation="vertical" flexItem sx={{ borderColor: textColor === 'common.white' ? 'rgba(255, 255, 255, 0.2)' : 'divider' }} />

      <Link href="/admin/login" style={{ textDecoration: 'none' }}>
         <Typography variant="body2" sx={{ color: textColor, '&:hover': { opacity: 0.8 }, textTransform: 'uppercase', fontSize: smallFontSize }}>
          {t('login')}
        </Typography>
      </Link>
      
      <Button 
        variant="outlined" 
        size="small" 
        component={Link} 
        href="/contact" 
        sx={{ 
          color: textColor, 
          borderColor: textColor,
          fontSize: smallFontSize, // Apply smaller font size
          fontWeight: 600,
          textTransform: 'uppercase',
          px: 1.5, // Reduced horizontal padding
          py: 0.25, // Reduced vertical padding
          '&:hover': { 
            borderColor: textColor, 
            opacity: 0.8 
          } 
        }}
      >
        {t('joinNow')}
      </Button>
    </Box>
  );
}