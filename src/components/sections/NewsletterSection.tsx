// /src/components/sections/NewsletterSection.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useTranslations } from 'next-intl';
import MainHeading from '../custom/MainHeading';

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
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <MainHeading 
            titleKey='title' 
            variant="h2"
            component="h2"
            t={t}  
            sx={{ fontWeight: 'bold', mb: 2 }}
            />
          <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: '500px', mx: 'auto' }}>
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
              variant="outlined"
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
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('submitButton')}
            </Button>
          </Box>
          {status && (
            <Alert severity={status.type} sx={{ mt: 3, justifyContent: 'center' }}>
              {status.message}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
}
