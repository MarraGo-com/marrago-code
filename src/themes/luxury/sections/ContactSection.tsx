// /src/themes/luxury/sections/ContactSection.tsx
'use client';

import React, { useState } from 'react';
import { 
  Grid, Typography, Box, Container, TextField, Button, 
  CircularProgress, Alert, Snackbar 
} from '@mui/material';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Dynamically import the InteractiveMap
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '400px', bgcolor: 'action.hover' }} />
  }
);

export default function ContactSection() {
  const t = useTranslations('ContactSection');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSnackbar({ ...snackbar, open: false });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message.');
      }
      setSnackbar({ open: true, message: t('alertSuccess'), severity: 'success' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: t('alertError'), severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md"> {/* Use a medium container for a more focused layout */}
          
          {/* --- THIS IS THE KEY CHANGE: A centered, single-column layout --- */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2"
              component="h2"
              sx={{ 
                fontFamily: '"Oranienbaum", serif', 
                fontWeight: 400, 
                mb: 3 
              }}
            >
              {t('title')}
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              {t('infoSubtitle')}
            </Typography>
          </Box>
          
          {/* Contact Form with refined styling */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid  size={{xs: 12, sm: 6}}>
                <TextField required fullWidth label={t('formNameLabel')} name="name" value={name} onChange={(e) => setName(e.target.value)} variant="filled" />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField required fullWidth label={t('formEmailLabel')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} variant="filled" />
              </Grid>
              <Grid size={{xs: 12}}>
                <TextField required fullWidth multiline rows={6} label={t('formMessageLabel')} name="message" value={message} onChange={(e) => setMessage(e.target.value)} variant="filled" />
              </Grid>
              <Grid size={{xs: 12}} sx={{ textAlign: 'center' }}>
                <Button 
                  type="submit" 
                  variant="outlined" // More elegant button style
                  color="primary" 
                  size="large" 
                  disabled={loading}
                  sx={{ minWidth: '200px' }}
                >
                  {loading ? <CircularProgress size={24} /> : t('formSubmitButton')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* The map is now a full-width section for a more dramatic, high-end feel */}
      <Box sx={{ height: '50vh', minHeight: 400 }}>
        <InteractiveMap latitude={30.4278} longitude={-9.5981} />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}