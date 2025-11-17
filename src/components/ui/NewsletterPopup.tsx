'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Dialog, 
  DialogContent,
  IconButton 
} from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';
import CloseIcon from '@mui/icons-material/Close';

const POPUP_DELAY = 5000; // 5 seconds
const STORAGE_KEY = 'newsletter_popup_seen';

export default function NewsletterPopup() {
  const t = useTranslations('Newsletter');
  const locale = useLocale() as 'en' | 'fr' | 'ar' | 'es';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Logic to control when the popup appears
  useEffect(() => {
    // 1. Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSeenPopup) {
      // 2. If not, wait 5 seconds, then show it
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, POPUP_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // 3. When closed, set localStorage so it doesn't appear again
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('errorGeneric'));
      }

      setStatus({ type: 'success', message: result.message });
      setEmail('');
      
      // If successful, wait 2 seconds then close the modal
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err: unknown) {
      if (err instanceof Error) { 
        setStatus({ type: 'error', message: err.message });
      } else {
        setStatus({ type: 'error', message: t('errorGeneric') });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          // Re-using your background image and overlay style from the section
          position: 'relative',
          backgroundImage: 'url(/images/taghazout-sunset2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          '&::before': { // The overlay
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.7)',
            zIndex: 1,
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 2, sm: 4 } }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              mb: 2 
            }}
          >
            {content.newsletterTitle}
          </Typography>
          
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: '500px', mx: 'auto' }}>
            {content.newsletterSubtitle}
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <TextField
              required
              fullWidth
              label={t('emailLabel')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 1,
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                '& .MuiFilledInput-input': { paddingTop: '30px' },
                '& .MuiFilledInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                  '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ 
                py: '15px', 
                px: 4,
                width: { xs: '100%', sm: 'auto' },
                whiteSpace: 'nowrap',
                borderRadius: '50px',
                fontWeight: 'bold',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('submitButton')}
            </Button>
          </Box>
          {status && (
            <Alert 
              severity={status.type} 
              sx={{ 
                mt: 3, 
                justifyContent: 'center',
                color: 'text.primary',
                bgcolor: status.type === 'success' ? 'success.light' : 'error.light',
              }}
            >
              {status.message}
            </Alert>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
}