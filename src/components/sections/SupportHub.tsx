// src/components/sections/SupportHub.tsx
'use client';

import React, { useState } from 'react';
import { 
  Box, Container, Grid, Typography, Paper, Button, TextField, 
  Stack, Chip, CircularProgress, Alert, Snackbar, useTheme, alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// --- ICONS ---
import ExploreIcon from '@mui/icons-material/Explore';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';

// --- DATA ---
import { siteConfig } from '@/config/client-data';
import { SiteConfig } from '@/config/site';

// --- DYNAMIC IMPORTS ---
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: 'action.hover', minHeight: 400 }} />
  }
);

// --- TYPES ---
type IntentType = 'planning' | 'booking' | 'general' | null;

// --- SUB-COMPONENT: SELECTION CARD (Now accepts theme props) ---
const SelectionCard = ({ 
  icon: Icon, title, desc, isSelected, onClick 
}: { 
  icon: any, title: string, desc: string, isSelected: boolean, onClick: () => void 
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={isSelected ? 8 : 1}
      onClick={onClick}
      sx={{
        p: 4, cursor: 'pointer', borderRadius: 3, height: '100%',
        // THEME-AWARE BORDER
        border: '2px solid', 
        borderColor: isSelected ? 'primary.main' : 'transparent',
        transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        // THEME-AWARE HOVER
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4, borderColor: isSelected ? 'primary.main' : 'divider' }
      }}
    >
      <Box sx={{ 
        p: 2, borderRadius: '50%', mb: 2,
        // THEME-AWARE COLORS
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'action.hover', 
        color: isSelected ? 'primary.main' : 'text.secondary'
      }}>
        <Icon fontSize="large" />
      </Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{desc}</Typography>
    </Paper>
  );
};

export default function SupportHub() {
  const t = useTranslations('ContactSection'); // Make sure to add these keys to your JSON!
  //const locale = useLocale() as 'en' | 'fr' | 'ar';
  const theme = useTheme();

  // --- UI STATE ---
  const [activeIntent, setActiveIntent] = useState<IntentType>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  
  // --- FORM STATE ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const handleIntentClick = (intent: IntentType) => {
    setActiveIntent(intent);
    setIsUrgent(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSnackbar({ ...snackbar, open: false });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send message.');
      
      setSnackbar({ open: true, message: t('alertSuccess'), severity: 'success' });
      setName(''); setEmail(''); setMessage('');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : t('alertError');
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const waNumber = siteConfig.contact.whatsappNumber?.replace(/\D/g, '') || '';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      
      {/* 1. HEADER HERO */}
      <Box sx={{ 
          bgcolor: 'background.paper', 
          py: { xs: 8, md: 10 }, 
          textAlign: 'center', 
          borderBottom: '1px solid',
          borderColor: 'divider'
      }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="text.secondary" letterSpacing={2}>
            {t('supportHubLabel')}
          </Typography>
          <Typography variant="h2" fontFamily='"Playfair Display", serif' fontWeight="bold" sx={{ mt: 1, mb: 2, color: 'text.primary' }}>
            {t('heroTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('heroSubtitle')}
          </Typography>
        </Container>
      </Box>

      {/* 2. TRIAGE SECTION */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={3}>
          <Grid  size= {{xs: 12, md: 4}}>
            <SelectionCard 
              icon={ExploreIcon} 
              title={t('cardPlanTitle')} 
              desc={t('cardPlanDesc')}
              isSelected={activeIntent === 'planning'} onClick={() => handleIntentClick('planning')}
            />
          </Grid>
          <Grid  size= {{xs: 12, md: 4}}>
            <SelectionCard 
              icon={ConfirmationNumberIcon} 
              title={t('cardBookingTitle')} 
              desc={t('cardBookingDesc')}
              isSelected={activeIntent === 'booking'} onClick={() => handleIntentClick('booking')}
            />
          </Grid>
          <Grid  size= {{xs: 12, md: 4}}>
            <SelectionCard 
              icon={EmailIcon} 
              title={t('cardGeneralTitle')} 
              desc={t('cardGeneralDesc')}
              isSelected={activeIntent === 'general'} onClick={() => handleIntentClick('general')}
            />
          </Grid>
        </Grid>
      </Container>

      {/* 3. DYNAMIC SOLUTION ZONE */}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <AnimatePresence mode="wait">
          
          {/* SCENARIO A: PLANNING */}
          {activeIntent === 'planning' && (
            <motion.div key="planning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, border: '1px solid', borderColor: 'primary.main' }}>
                <Box display="flex" alignItems="center" mb={4}>
                  <Box sx={{ position: 'relative', width: 60, height: 60, mr: 2, bgcolor: 'action.hover', borderRadius: '50%' }}>
                      <Image src={siteConfig.logo} alt="Agent" fill style={{ objectFit: 'contain', padding: 5 }} /> 
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{t('chatTitle')}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('chatSubtitle')}</Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid  size= {{xs: 12, md: 6}}>
                      <Button 
                        fullWidth variant="contained" size="large" startIcon={<WhatsAppIcon />}
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(t('waPlanMessage'))}`}
                        target="_blank"
                        sx={{ bgcolor: '#25D366', color: '#fff', py: 2, '&:hover': { bgcolor: '#128C7E' } }}
                      >
                        {t('btnWhatsapp')}
                      </Button>
                  </Grid>
                  <Grid  size= {{xs: 12, md: 6}}>
                      <Button 
                        fullWidth variant="outlined" size="large" startIcon={<ExploreIcon />}
                        href="/planning"
                        sx={{ py: 2 }} // Inherits primary color from theme
                      >
                        {t('btnPlanner')}
                      </Button>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          )}

          {/* SCENARIO B: BOOKING */}
          {activeIntent === 'booking' && (
            <motion.div key="booking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom>{t('urgencyQuestion')}</Typography>
                <Stack direction="row" spacing={1} mb={4}>
                  <Chip 
                    label={t('urgencyYes')} 
                    color={isUrgent ? "error" : "default"} 
                    onClick={() => setIsUrgent(true)} 
                    clickable 
                  />
                  <Chip 
                    label={t('urgencyNo')} 
                    color={!isUrgent ? "primary" : "default"} 
                    onClick={() => setIsUrgent(false)} 
                    clickable 
                  />
                </Stack>

                {isUrgent ? (
                  // URGENT STATE: Theme-aware Error Box
                  <Box sx={{ 
                      p: 3, borderRadius: 2, border: '1px solid', 
                      bgcolor: alpha(theme.palette.error.main, 0.1), 
                      borderColor: alpha(theme.palette.error.main, 0.3) 
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>{t('priorityTitle')}</Typography>
                    <Typography variant="body2" mb={2} color="text.primary">{t('priorityDesc')}</Typography>
                    <Button 
                      variant="contained" color="error" startIcon={<WhatsAppIcon />}
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(t('waUrgentMessage'))}`}
                    >
                      {t('btnDispatch')}
                    </Button>
                  </Box>
                ) : (
                  // STANDARD FORM
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid  size= {{xs: 12}}><TextField fullWidth label={t('formBookingRef')} variant="outlined" /></Grid>
                        <Grid  size= {{xs: 12, md: 6}}><TextField required fullWidth label={t('formNameLabel')} value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                        <Grid  size= {{xs: 12, md: 6}}><TextField required fullWidth type="email" label={t('formEmailLabel')} value={email} onChange={(e) => setEmail(e.target.value)} /></Grid>
                        <Grid  size= {{xs: 12}}><TextField required fullWidth multiline rows={4} label={t('formMessageLabel')} value={message} onChange={(e) => setMessage(e.target.value)} /></Grid>
                        <Grid  size= {{xs: 12}}>
                           <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={<SendIcon />}>
                             {loading ? <CircularProgress size={24} /> : t('formSubmitButton')}
                           </Button>
                        </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}

          {/* SCENARIO C: GENERAL */}
          {activeIntent === 'general' && (
            <motion.div key="general" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4 }}>
                  <Typography variant="h6" gutterBottom mb={3}>{t('generalFormTitle')}</Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid  size= {{xs: 12, md: 6}}><TextField required fullWidth label={t('formNameLabel')} value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                        <Grid  size= {{xs: 12, md: 6}}><TextField required fullWidth type="email" label={t('formEmailLabel')} value={email} onChange={(e) => setEmail(e.target.value)} /></Grid>
                        <Grid  size= {{xs: 12}}><TextField required fullWidth multiline rows={4} label={t('formMessageLabel')} value={message} onChange={(e) => setMessage(e.target.value)} /></Grid>
                        <Grid  size= {{xs: 12}}>
                           <Button type="submit" variant="contained" size="large" disabled={loading}>
                             {loading ? <CircularProgress size={24} /> : t('formSubmitButton')}
                           </Button>
                        </Grid>
                    </Grid>
                  </Box>
               </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* 4. LOCALITY BLOCK */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Grid container spacing={4}>
            <Grid  size= {{xs: 12, md: 5}}>
                <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom color="text.primary">
                    {t('hqTitle')}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {t('hqDesc')}
                </Typography>
                
                <Stack spacing={3} mt={4}>
                    {siteConfig.contact.address && (
                        <Box display="flex" gap={2}>
                            <LocationOnIcon color="primary" />
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">{t('labelAddress')}</Typography>
                                <Typography variant="body2" color="text.secondary">{siteConfig.contact.address}</Typography>
                            </Box>
                        </Box>
                    )}
                    <Box display="flex" gap={2}>
                        <AccessTimeIcon color="primary" />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">{t('labelHours')}</Typography>
                            <Typography variant="body2" color="text.secondary">Mon-Sat: 09:00 - 19:00</Typography>
                        </Box>
                    </Box>
                    {siteConfig.contact.phone && (
                        <Box display="flex" gap={2}>
                            <PhoneIcon color="primary" />
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">{t('labelPhone')}</Typography>
                                <Typography variant="body2" color="text.secondary">{siteConfig.contact.phone}</Typography>
                            </Box>
                        </Box>
                    )}
                </Stack>
            </Grid>

            <Grid  size= {{xs: 12, md: 7}}>
                <Box sx={{ height: 400, width: '100%', borderRadius: 4, overflow: 'hidden', position: 'relative', boxShadow: 3 }}>
                    <InteractiveMap 
                        latitude={(siteConfig as SiteConfig).contact.latitude || 0} 
                        longitude={(siteConfig as SiteConfig).contact.longitude || 0} 
                    />
                </Box>
            </Grid>
        </Grid>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

    </Box>
  );
}