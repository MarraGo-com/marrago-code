'use client';

import React, { useState } from 'react';
import { 
  Grid, Typography, Box, Container, TextField, Button, 
  CircularProgress, Alert, Snackbar, Stack 
} from '@mui/material';
// Kept for UI-specific text like placeholders and errors
import { useTranslations } from 'next-intl';
// NEW: Import client data and locale hook for main content
import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px', background: '#e0e0e0' }} />
  }
);

export default function ContactSection() {
  // `t` is still used for UI text (labels, alerts, button)
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
  
  // NEW: Get content for title and subtitle
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.contactPage || siteConfig.textContent.en.contactPage;

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
            {content.title}
          </Typography>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 4 }}>
              {/* REFINED: Wrapped content in a Stack for better spacing */}
              <Stack spacing={3}>
                {siteConfig.slogan && (
                    <Typography 
                        variant="h6" 
                        component="p" 
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                    >
                        {siteConfig.slogan}
                    </Typography>
                )}
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: '600', mb: 1, color: 'text.primary' }}>
                        {content.infoTitle}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {content.infoSubtitle}
                    </Typography>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField required fullWidth label={t('formNameLabel')} name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField required fullWidth label={t('formEmailLabel')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField required fullWidth multiline rows={6} label={t('formMessageLabel')} name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : t('formSubmitButton')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{height: '100%', minHeight: 400}}>
                <InteractiveMap latitude={siteConfig.contact.latitude || 0} longitude={siteConfig.contact.longitude || 0} />
              </Box>
            </Grid>
          </Grid>
        </Container>
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
