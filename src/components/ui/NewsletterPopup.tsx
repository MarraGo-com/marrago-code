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
  IconButton,
  Fade
} from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SendIcon from '@mui/icons-material/Send';

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
    const hasSeenPopup = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, POPUP_DELAY);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
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
      
      setTimeout(() => {
        handleClose();
      }, 2500);

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
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden', // Ensures background doesn't bleed
          backgroundImage: 'url(/images/taghazout-sunset2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', // Deep shadow for popup effect
        }
      }}
    >
      {/* 1. Background Overlay (Matches Section) */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%)', zIndex: 1 }} />

      {/* 2. Glassmorphism Content Container */}
      <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 3, sm: 5 }, backdropFilter: 'blur(3px)' }}>
        
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ textAlign: 'center', p: 0, mt: 2 }}>
          
          {/* Icon Badge */}
          <Box sx={{ display: 'inline-flex', p: 2, bgcolor: 'primary.main', borderRadius: '50%', mb: 3, boxShadow: '0 0 20px rgba(230, 81, 0, 0.5)' }}>
             <MenuBookIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>

          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontWeight: 800, 
              fontFamily: '"Playfair Display", serif',
              mb: 1.5,
              lineHeight: 1.2
            }}
          >
            {content.newsletterTitle}
          </Typography>
          
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, fontSize: '0.95rem', lineHeight: 1.6 }}>
            {content.newsletterSubtitle}
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Theme Aware Input (Same as Section) */}
            <TextField
              required
              fullWidth
              placeholder={t('emailLabel')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                width: '100%',
                bgcolor: 'background.paper', // White in light mode
                borderRadius: 50,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 50,
                    height: '50px', // Slightly smaller for popup
                    '& fieldset': { border: 'none' }, 
                },
                '& input': {
                    color: 'text.primary', // Dark text inside white input
                    pl: 3,
                    fontSize: '0.95rem',
                    '&::placeholder': {
                        color: 'text.secondary',
                        opacity: 0.7,
                    }
                }
              }}
            />

            {/* Enhanced Button (Same as Section) */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={!loading && <SendIcon />}
              sx={{ 
                width: '100%',
                py: 1.5,
                borderRadius: 50,
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(230, 81, 0, 0.4)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(230, 81, 0, 0.6)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('submitButton')}
            </Button>
          </Box>
          
          <Typography variant="caption" sx={{ display: 'block', mt: 2.5, opacity: 0.5, fontSize: '0.75rem' }}>
              {t('privacy')}
          </Typography>

          {status && (
            <Alert 
              severity={status.type} 
              sx={{ 
                mt: 3, 
                borderRadius: 2,
                bgcolor: status.type === 'success' ? 'rgba(237, 247, 237, 0.95)' : 'rgba(253, 236, 234, 0.95)',
                color: 'text.primary' // Ensure text is readable against light alert bg
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