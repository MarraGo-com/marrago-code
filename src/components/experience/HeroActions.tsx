// /src/components/experience/HeroActions.tsx
'use client';

import React, { useState } from 'react';
import { Stack, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
// ▼▼▼ NEW IMPORT ▼▼▼
import { useTranslations } from 'next-intl';

interface HeroActionsProps {
  title: string;
}

export default function HeroActions({ title }: HeroActionsProps) {
  // ▼▼▼ GET TRANSLATIONS ▼▼▼
  const t = useTranslations('ExperienceDetailsNew');

  // State for Wishlist toggle (visual only for now)
  const [isSaved, setIsSaved] = useState(false);
  // State for Share notification
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSaveClick = () => {
    // In the future, this will connect to the backend to save to user's wishlist
    setIsSaved(!isSaved);
  };

  const handleShareClick = async () => {
    const url = window.location.href;
    const shareData = {
      title: title,
      // ▼▼▼ TRANSLATED WITH VARIABLE ▼▼▼
      text: t('shareMessage', { title: title }),
      url: url,
    };

    // Use the native browser Web Share API if available (mostly on mobile)
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for desktop: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // ▼▼▼ TRANSLATED ▼▼▼
        setSnackbarMessage(t('shareSuccess'));
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (err) {
        // ▼▼▼ TRANSLATED ▼▼▼
        setSnackbarMessage(t('shareError'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
              return err instanceof Error ? err.message : 'Failed to copy link';

      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Common style for the buttons to make them stand out on the dark background
  const buttonStyle = {
    color: 'white',
    bgcolor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(5px)',
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.3)',
    },
  };

  return (
    <>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* ▼▼▼ TRANSLATED TOOLTIP ▼▼▼ */}
        <Tooltip title={t('shareTooltip')}>
          <IconButton onClick={handleShareClick} sx={buttonStyle}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* ▼▼▼ TRANSLATED TOOLTIP ▼▼▼ */}
        <Tooltip title={isSaved ? t('saveTooltip') : t('saveTooltip')}>
          <IconButton onClick={handleSaveClick} sx={buttonStyle}>
            {isSaved ? (
              <FavoriteIcon fontSize="small" sx={{ color: '#ff4d4d' }} /> // Red heart when saved
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Notification for link copying */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}