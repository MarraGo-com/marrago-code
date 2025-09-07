// /src/themes/adventure/sections/NewsletterSection.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useTranslations } from 'next-intl';
import MainHeading from '../../default/custom/MainHeading';

export default function NewsletterSection() {
  const t = useTranslations('Newsletter');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      setEmail(''); // Clear the form on success

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
    <Box 
        sx={{ 
            position: 'relative',
            py: { xs: 8, md: 12 }, 
            backgroundImage: 'url(/images/taghazout-sunset2.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
        }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.7)', zIndex: 1 }} />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <MainHeading 
            titleKey='title' 
            variant="h2"
            component="h2"
            t={t}  
            sx={{ 
                fontWeight: 'bold', 
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                mb: 2 
            }}
            />
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: '500px', mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '600px',
              mx: 'auto'
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
                  '& .MuiInputLabel-root': { 
                      color: 'rgba(255,255,255,0.7)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                  },
                  // ## THIS IS THE FIX ##
                  // This adds more space between the shrunken label and the input text.
                  '& .MuiFilledInput-input': {
                      paddingTop: '50px',
                  },
                  '& .MuiFilledInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                           backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&.Mui-focused': {
                           backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      }
                  },
                  '& .MuiInputBase-input': {
                      color: 'white',
                  },
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
        </Box>
      </Container>
    </Box>
  );
}