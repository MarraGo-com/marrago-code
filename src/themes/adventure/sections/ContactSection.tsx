// /src/themes/adventure/sections/ContactSection.tsx
'use client';

import React, { useState } from 'react';
import {
  Grid, Typography, Box, Container, TextField, Button,
  CircularProgress, Alert, Snackbar, Paper
} from '@mui/material';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Import action-oriented icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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
      <Box sx={{ position: 'relative', py: { xs: 8, md: 12 } }}>
        {/* Full-width map background */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <InteractiveMap latitude={30.4278} longitude={-9.5981} />
        </Box>
        {/* Dark overlay for readability */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.6)', zIndex: 2 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 12 }}>
                 <Grid container spacing={5}>
                    {/* Left Column: Contact Info */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {t('infoTitle')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            {t('infoSubtitle')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                                <Typography>Agadir, Morocco</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                                <Typography>+212 123 456 789</Typography>
                            </Box>
                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon color="primary" sx={{ mr: 2 }} />
                                <Typography>contact@adventure.com</Typography>
                            </Box>
                        </Box>
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