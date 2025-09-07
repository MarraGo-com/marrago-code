// /src/themes/luxury/sections/NewsletterSection.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useTranslations } from 'next-intl';
import MainHeading from '../../default/custom/MainHeading';
import EastIcon from '@mui/icons-material/East'; // An elegant arrow icon

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
      setEmail('');

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
    // --- THIS IS THE KEY CHANGE ---
    // A dark, contrasting background makes this section feel like a premium footer element.
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.900', color: 'white' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <MainHeading 
            titleKey='title' 
            variant="h2"
            component="h2"
            t={t}  
            sx={{ 
            //  fontFamily: 'lora, serif',
              fontWeight: 500,
              mb: 2 
            }}
          />
          <Typography sx={{ color: 'grey.400', mb: 5, maxWidth: '500px', mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.700' }}>
              <TextField
                required
                fullWidth
                placeholder={t('emailLabel')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard" // Minimalist variant
                InputProps={{
                  disableUnderline: true, // Remove the default underline
                  sx: { 
                    color: 'white', 
                    fontSize: '1.2rem',
                    '::placeholder': {
                      color: 'grey.500',
                    }
                  }
                }}
              />
              <Button
                type="submit"
                variant="text"
                disabled={loading}
                sx={{ p: 1, minWidth: 'auto' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : <EastIcon sx={{ color: 'white' }} />}
              </Button>
            </Box>
          </Box>
          {status && (
            <Alert 
              severity={status.type} 
              sx={{ 
                mt: 3, 
                justifyContent: 'center',
                color: status.type === 'success' ? 'text.primary' : 'inherit',
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