'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Paper, Button, TextField, 
  Stack, LinearProgress, useTheme, alpha, IconButton, Chip, CircularProgress, Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';

// --- ICONS ---
import SurfingIcon from '@mui/icons-material/Surfing';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LandscapeIcon from '@mui/icons-material/Landscape';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// --- DATA & CONTEXT ---
import { destinationClusters } from '@/config/locations';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/i18n/navigation';

// --- NOTIFICATIONS ---
import { toast, Toaster } from 'react-hot-toast'; 

const TOTAL_STEPS = 4;

// --- SUB-COMPONENTS (Keep same as provided) ---

const ClusterCard = ({ title, subtitle, tags, image, isSelected, onClick }: any) => {
    const theme = useTheme();
    return (
      <Paper
        elevation={isSelected ? 8 : 2}
        onClick={onClick}
        sx={{
          cursor: 'pointer', borderRadius: 4, position: 'relative', overflow: 'hidden',
          height: '100%', minHeight: 280, border: '3px solid',
          borderColor: isSelected ? 'primary.main' : 'transparent',
          transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[10] }
        }}
      >
        <Box sx={{ position: 'relative', height: 160, width: '100%' }}>
           <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
            {isSelected && (
              <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3, bgcolor: 'white', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                <CheckCircleIcon color="primary" />
              </Box>
            )}
        </Box>
        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom lineHeight={1.2}>{title}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, lineHeight: 1.4 }}>{subtitle}</Typography>
          </Box>
          <Stack direction="row" gap={0.5} flexWrap="wrap">
             {tags.map((tag: string) => (
               <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'action.hover', color: isSelected ? 'primary.main' : 'text.secondary' }} />
             ))}
          </Stack>
        </Box>
      </Paper>
    );
};

const SimpleOptionCard = ({ icon: Icon, title, isSelected, onClick }: any) => {
    const theme = useTheme();
    return (
      <Paper
        elevation={isSelected ? 4 : 1}
        onClick={onClick}
        sx={{
          p: 3, cursor: 'pointer', borderRadius: 3, border: '2px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' }
        }}
      >
        <Icon sx={{ fontSize: 40, color: isSelected ? 'primary.main' : 'text.secondary' }} />
        {/* Render translated label */}
        <Typography variant="subtitle1" fontWeight="bold" color={isSelected ? 'primary.main' : 'text.primary'}>{title}</Typography>
        {isSelected && <CheckCircleIcon sx={{ position: 'absolute', top: 10, right: 10, color: 'primary.main' }} />}
      </Paper>
    );
};

export default function TripWizard() {
  const t = useTranslations('TripWizard'); // Hook initialized
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    destinations: [] as string[],
    interests: [] as string[],
    duration: '',
    budget: '',
    travelers: '',
    date: '',
    name: '',
    email: '',
    whatsapp: ''
  });

  // --- PERSISTENCE & AUTH EFFECTS (Keep existing) ---
  useEffect(() => {
    const savedData = localStorage.getItem('tripWizardData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            setFormData(parsed);
        } catch (e) {
            console.error("Failed to load saved trip", e);
        }
    }
  }, []);

  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            name: user.displayName || prev.name,
            email: user.email || prev.email
        }));
    }
  }, [user]);

  // --- LOCALIZED VALIDATION ---
  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (formData.destinations.length === 0) { toast.error(t('errors.selectRegion')); return false; }
        return true;
      case 2:
        if (formData.interests.length === 0) { toast.error(t('errors.selectInterest')); return false; }
        return true;
      case 3:
        if (!formData.travelers) { toast.error(t('errors.selectTravelers')); return false; }
        if (!formData.date) { toast.error(t('errors.selectDate')); return false; }
        if (!formData.duration) { toast.error(t('errors.selectDuration')); return false; }
        if (!formData.budget) { toast.error(t('errors.selectBudget')); return false; }
        return true;
      case 4:
        if (user) {
            if (!formData.name.trim()) { toast.error(t('errors.confirmName')); return false; }
            if (!formData.email.trim()) { toast.error(t('errors.confirmEmail')); return false; }
        }
        return true;
      default:
        return true;
    }
  };

  // --- ACTIONS (Keep Logic, Update Toasts) ---
  const handleGuestSave = () => {
    localStorage.setItem('tripWizardData', JSON.stringify(formData));
    router.push('/signup?returnUrl=/planning');
  };

  const submitTripRequest = async () => {
    setIsSubmitting(true);
    // Localized Loading Toast
    const toastId = toast.loading(t('form.sending'));

    try {
        const messageHtml = `
        <h3 style="color: #D97706;">New Trip Wizard Request</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>👤 User:</strong> ${user ? 'Registered' : 'Guest'}</li>
          <li><strong>🌍 Regions:</strong> ${formData.destinations.join(', ')}</li>
          <li><strong>👥 Travelers:</strong> ${formData.travelers}</li> 
          <li><strong>📅 Date:</strong> ${formData.date}</li>           
          <li><strong>❤️ Interests:</strong> ${formData.interests.join(', ')}</li>
          <li><strong>⏱️ Duration:</strong> ${formData.duration}</li>
          <li><strong>💰 Budget:</strong> ${formData.budget}</li>
          <li><strong>📱 WhatsApp:</strong> ${formData.whatsapp || 'Not provided'}</li>
        </ul>
      `;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Trip Request: ${formData.destinations[0]}...`,
          message: messageHtml, 
          saveToDb: true,
          userId: user?.uid || null,
          tripData: {
            destinations: formData.destinations,
            interests: formData.interests,
            travelers: formData.travelers,
            date: formData.date,
            duration: formData.duration,
            budget: formData.budget,
            whatsapp: formData.whatsapp,
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to send');

      localStorage.removeItem('tripWizardData');
      // Localized Success Toast
      toast.success(t('success.requestSent'), { id: toastId });
      
      if (user) router.push('/account');

    } catch (error) {
      console.error('Submission Error:', error);
      toast.error(t('errors.generic'), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) return; 
    if (step === TOTAL_STEPS) {
        if (user) { submitTripRequest(); } else { handleGuestSave(); }
    } else {
        setDirection(1);
        setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) { setDirection(-1); setStep(step - 1); }
  };

  const toggleSelection = (field: 'destinations' | 'interests', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const exists = current.includes(value);
      return { ...prev, [field]: exists ? current.filter(item => item !== value) : [...current, value] };
    });
  };

  const progress = (step / TOTAL_STEPS) * 100;

  // --- RENDERERS ---
  const renderStep = () => {
    switch (step) {
      case 1: // REGIONS
        return (
          <Box>
            <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>{t('steps.1.title')}</Typography>
            <Typography color="text.secondary" mb={4}>{t('steps.1.subtitle')}</Typography>
            <Grid container spacing={2}>
              {destinationClusters.map((cluster) => (
                <Grid key={cluster.id} size={{xs: 12, sm: 6, md: 4}}>
                  <ClusterCard 
                    // Note: Cluster titles/subtitles come from config/locations. 
                    // If you need those translated, they should be mapped in the config file itself.
                    title={cluster.title} subtitle={cluster.subtitle} image={cluster.image} tags={cluster.tags}
                    isSelected={formData.destinations.includes(cluster.title)}
                    onClick={() => toggleSelection('destinations', cluster.title)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2: // INTERESTS
        return (
          <Box>
            <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>{t('steps.2.title')}</Typography>
            <Typography color="text.secondary" mb={4}>{t('steps.2.subtitle')}</Typography>
            <Grid container spacing={2}>
              {[ { label: 'Surfing', icon: SurfingIcon }, { label: 'Relaxation', icon: BeachAccessIcon }, { label: 'Culinary', icon: RestaurantIcon }, { label: 'Adventure', icon: LandscapeIcon } ].map((interest) => (
                <Grid key={interest.label} size={{xs: 6, md: 3}}>
                  <SimpleOptionCard 
                    icon={interest.icon} 
                    // Localize the displayed title
                    title={t(`options.interests.${interest.label}`)}
                    isSelected={formData.interests.includes(interest.label)}
                    onClick={() => toggleSelection('interests', interest.label)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 3: // LOGISTICS
      return (
        <Box>
          <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>{t('steps.3.title')}</Typography>
          <Stack spacing={4} mt={4}>
             <Box>
                <Typography variant="subtitle2" gutterBottom>{t('steps.3.travelersLabel')}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {['Solo', 'Couple', 'Family', 'Group', 'Friends'].map(opt => (
                    <Chip 
                        key={opt} 
                        // Localize Chip Label
                        label={t(`options.travelers.${opt}`)} 
                        onClick={() => setFormData({...formData, travelers: opt})} 
                        color={formData.travelers === opt ? "primary" : "default"} variant={formData.travelers === opt ? "filled" : "outlined"} sx={{ p: 1, px: 2 }} 
                    />
                  ))}
                </Stack>
             </Box>
             <Box>
               <Typography variant="subtitle2" gutterBottom>{t('steps.3.dateLabel')}</Typography>
               <TextField 
                   fullWidth 
                   placeholder={t('steps.3.datePlaceholder')} 
                   value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} 
                   helperText={t('steps.3.dateHelper')} 
               />
             </Box>
             <Box>
                <Typography variant="subtitle2" gutterBottom>{t('steps.3.durationLabel')}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {['3-5 Days', '1 Week', '10 Days', '2 Weeks+'].map(opt => (
                    <Chip 
                        key={opt} 
                        // Localize Chip Label
                        label={t(`options.duration.${opt}`)} 
                        onClick={() => setFormData({...formData, duration: opt})} 
                        color={formData.duration === opt ? "primary" : "default"} variant={formData.duration === opt ? "filled" : "outlined"} sx={{ p: 1, px: 2 }} 
                    />
                  ))}
                </Stack>
             </Box>
             <Box>
                <Typography variant="subtitle2" gutterBottom>{t('steps.3.budgetLabel')}</Typography>
                 <Stack direction="row" gap={1} flexWrap="wrap">
                  {['Economy', 'Comfort', 'Luxury'].map(opt => (
                    <Chip 
                        key={opt} 
                        // Localize Chip Label
                        label={t(`options.budget.${opt}`)} 
                        onClick={() => setFormData({...formData, budget: opt})} 
                        color={formData.budget === opt ? "primary" : "default"} variant={formData.budget === opt ? "filled" : "outlined"} sx={{ p: 1, px: 2 }} 
                    />
                  ))}
                </Stack>
             </Box>
          </Stack>
        </Box>
      );
      case 4: // CONTACT / AUTH
        return (
          <Box>
            <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
               {user ? t('steps.4.userTitle') : t('steps.4.guestTitle')}
            </Typography>
            <Typography color="text.secondary" mb={4}>
               {user ? t('steps.4.userSubtitle') : t('steps.4.guestSubtitle')}
            </Typography>

            {/* GUEST VIEW */}
            {!user && (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', borderColor: 'primary.main', bgcolor: 'alpha(primary.main, 0.05)' }}>
                    <LockIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>{t('steps.4.unlockCard.title')}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {t('steps.4.unlockCard.text')}
                    </Typography>
                    <Button variant="contained" onClick={handleGuestSave} size="large" sx={{ borderRadius: 50, px: 4 }}>
                        {t('steps.4.unlockCard.button')}
                    </Button>
                </Paper>
            )}

            {/* LOGGED IN USER VIEW */}
            {user && (
                <Grid container spacing={3}>
                    <Grid size={{xs: 12}}>
                        <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
                            {t('steps.4.successAlert')} <strong>{user.displayName || user.email}</strong>
                        </Alert>
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField fullWidth label={t('form.nameLabel')} value={formData.name} disabled />
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField fullWidth label={t('form.emailLabel')} value={formData.email} disabled />
                    </Grid>
                    <Grid size={{xs: 12}}>
                        <TextField 
                            fullWidth 
                            label={t('steps.4.whatsappLabel')} 
                            placeholder="+212..." 
                            value={formData.whatsapp} 
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
                            helperText={t('steps.4.whatsappHelper')} 
                        />
                    </Grid>
                </Grid>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: { xs: 10, md: 15 }, pb: 10 }}>
      <Container maxWidth="md">
        
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
           <IconButton onClick={handleBack} disabled={step === 1 || isSubmitting} size="small"><ArrowBackIcon /></IconButton>
           <Box sx={{ flex: 1 }}><LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} /></Box>
           <Typography variant="body2" color="text.secondary">Step {step} of {TOTAL_STEPS}</Typography>
        </Box>

        <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, minHeight: 400, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
             <Button 
               variant="contained" size="large" onClick={handleNext} disabled={isSubmitting}
               endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : (step === TOTAL_STEPS ? (user ? <ArrowForwardIcon /> : <LockIcon />) : <ArrowForwardIcon />)}
               sx={{ borderRadius: 50, px: 5, py: 1.5 }}
             >
               {step === TOTAL_STEPS 
                 ? (user ? (isSubmitting ? t('form.sending') : t('form.sendButton')) : t('form.submitButton')) 
                 : t('btnNext')}
             </Button>
          </Box>
        </Paper>

        <Toaster position="bottom-center" />

      </Container>
    </Box>
  );
}