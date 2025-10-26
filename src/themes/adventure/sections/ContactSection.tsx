'use client';

import React, { useState } from 'react';
import {
  Grid, Typography, Box, Container, TextField, Button,
  CircularProgress, Alert, Snackbar, Paper, Stack
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';

import dynamic from 'next/dynamic';

// Import action-oriented icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from '@/i18n/navigation';
import { SiteConfig } from '@/config/site';

const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: '#e0e0e0' }} />
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
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 12 }}>
            <Grid container spacing={5}>
              {/* Left Column: Contact Info */}
              <Grid size={{ xs: 12, md: 5 }}>
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
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {content.infoTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {content.infoSubtitle}
                  </Typography>
                  
                  <Stack spacing={2}>
                    {siteConfig.contact.address && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LocationOnIcon color="primary" sx={{ mr: 2, mt: '2px' }} />
                        <Typography>{siteConfig.contact.address}</Typography>
                      </Box>
                    )}
                    {siteConfig.contact.phone && (
                      <Link href={`tel:${siteConfig.contact.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon color="primary" sx={{ mr: 2 }} />
                          <Typography>{siteConfig.contact.phone}</Typography>
                        </Box>
                      </Link>
                    )}
                    {siteConfig.contact.whatsappNumber && (
                      <Link href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WhatsAppIcon color="primary" sx={{ mr: 2 }} />
                          <Typography>{siteConfig.contact.whatsappNumber}</Typography>
                        </Box>
                      </Link>
                    )}
                    {siteConfig.contact.email && (
                      <Link href={`mailto:${siteConfig.contact.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon color="primary" sx={{ mr: 2 }} />
                          <Typography>{siteConfig.contact.email}</Typography>
                        </Box>
                      </Link>
                    )}
                  </Stack>
                </Stack>
              </Grid>

              {/* Right Column: Contact Form */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField required fullWidth label={t('formNameLabel')} name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField required fullWidth label={t('formEmailLabel')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField required fullWidth multiline rows={4} label={t('formMessageLabel')} name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ borderRadius: '50px', px: 4 }}>
                        {loading ? <CircularProgress size={24} /> : t('formSubmitButton')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Map is now a separate, full-width section below the form */}
      <Box sx={{ height: '50vh', minHeight: 400 }}>
        {/* UPDATED: Using dynamic coordinates from siteConfig */}
        <InteractiveMap latitude={(siteConfig as SiteConfig).contact.latitude || 0} longitude={(siteConfig as SiteConfig).contact.longitude || 0} />
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

