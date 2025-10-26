'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import { 
  Grid, Typography, Box, Container, TextField, Button, 
  CircularProgress, Alert, Snackbar 
} from '@mui/material';
// Kept for UI-specific text like placeholders and errors
import { useTranslations } from 'next-intl';
// NEW: Import client data and locale hook for main content
import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';

// UPDATED: Use MainHeadingUserContent for direct title prop
import MainHeadingUserContent from '../../../components/custom/MainHeadingUserContent';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: 'action.hover' }} />
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
  
  // NEW: State to ensure map renders only on the client after mount
  const [isClient, setIsClient] = useState(false);

  // NEW: Get content for title and subtitle
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.contactPage || siteConfig.textContent.en.contactPage;

  // NEW: useEffect to set the isClient state to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);


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
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <MainHeadingUserContent
              title={content.title}
              variant="h2"
              component="h2"
              sx={{ 
                fontFamily: '"Oranienbaum", serif', 
                fontWeight: 400, 
                mb: 2 
              }}
            />
            {siteConfig.slogan && (
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ mb: 3, color: 'primary.main', fontWeight: 500 }}
              >
                {siteConfig.slogan}
              </Typography>
            )}
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              {content.infoSubtitle}
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid size={{xs: 12, sm: 6}}>
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
                  variant="outlined"
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

      <Box sx={{ height: '50vh', minHeight: 400 }}>
        {/* UPDATED: Conditionally render map only when isClient is true */}
        {isClient && (
            <InteractiveMap latitude={siteConfig.contact.latitude || 0} longitude={siteConfig.contact.longitude || 0} />
        )}
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

