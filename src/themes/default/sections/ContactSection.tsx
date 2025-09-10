// /src/components/sections/ContactSection.tsx
'use client';

import React, { useState } from 'react';
import { 
  Grid, Typography, Box, Container, TextField, Button, 
  CircularProgress, Alert, Snackbar 
} from '@mui/material';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// ✅ This is the correct way to dynamically import a client-only component.
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'), // Adjust path if needed
  {
    ssr: false, // This ensures it's only rendered on the client
    loading: () => <div style={{ height: '400px', background: '#e0e0e0' }} /> // A placeholder while the map loads
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
    console.log('Form submission initiated...');
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
        throw new Error(result.error || 'Failed to send message. Please try again later.');
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
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 8, color: 'text.primary' }}>
            {t('title')}
          </Typography>
          {/* --- THIS IS THE NEW TWO-COLUMN LAYOUT --- */}
          <Grid container spacing={6}>
            {/* Left Column: Contact Info & Form */}
            <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: '600', mb: 3, color: 'text.primary' }}>
                {t('infoTitle')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                {t('infoSubtitle')}
              </Typography>
              
              {/* Contact Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid  size= {{ xs: 12, sm: 6 }}>
                    <TextField required fullWidth label={t('formNameLabel')} name="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </Grid>
                  <Grid size= {{ xs: 12, sm: 6 }}>
                    <TextField required fullWidth label={t('formEmailLabel')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Grid>
                  <Grid  size={{ xs: 12 }}>
                    <TextField required fullWidth multiline rows={6} label={t('formMessageLabel')} name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                  </Grid>
                  <Grid  size= {{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : t('formSubmitButton')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Column: Interactive Map */}
            <Grid  size={{ xs: 12, sm: 6, md: 8 }}>
              <Box sx={{height: '100%', minHeight: 400}}>
                {/* We use the coordinates for Biougra as our example */}
                <InteractiveMap latitude={30.2167} longitude={-9.3667} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Snackbar component for notifications */}
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
