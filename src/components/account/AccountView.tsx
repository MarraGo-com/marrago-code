// src/components/account/AccountView.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Paper, Grid, Chip, Button, 
    Skeleton, Stack, Avatar, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl'; 
import { firestore as db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import Image from 'next/image';

// --- ICONS ---
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LoopIcon from '@mui/icons-material/Loop';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';

// --- LOCALIZED SUB-COMPONENTS ---

const KitchenTracker = () => {
    const t = useTranslations('AccountPage.tracker');
    const steps = [
        { label: t('step1'), status: 'completed' },
        { label: t('step2'), status: 'active' }, 
        { label: t('step3'), status: 'waiting' },
        { label: t('step4'), status: 'waiting' }
    ];
    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold" sx={{ letterSpacing: 1 }}>
                {t('title')}
            </Typography>
            <Stack spacing={2}>
                {steps.map((step, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {step.status === 'completed' && <CheckCircleIcon color="success" />}
                        {step.status === 'active' && <LoopIcon sx={{ color: 'primary.main', animation: 'spin 2s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />}
                        {step.status === 'waiting' && <RadioButtonUncheckedIcon color="disabled" />}
                        <Typography color={step.status === 'waiting' ? 'text.disabled' : 'text.primary'} fontWeight={step.status === 'active' ? 'bold' : 'normal'}>{step.label}</Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

const PreferenceTuner = () => {
    const t = useTranslations('AccountPage.tuner');
    return (
        <Paper variant="outlined" sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{t('title')}</Typography>
            <Stack spacing={1}>
                <Chip label={t('option1')} onDelete={() => {}} color="primary" variant="outlined" />
                <Chip label={t('option2')} onDelete={() => {}} color="primary" variant="outlined" />
            </Stack>
        </Paper>
    );
};

// --- MAIN COMPONENT ---
export default function AccountView() {
  const t = useTranslations('AccountPage');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [trip, setTrip] = useState<any>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  
  // Settings Dialog State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // 1. Auth Guard
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (user) setNewName(user.displayName || '');
  }, [user, authLoading, router]);

  // 2. Fetch Trip
  useEffect(() => {
    async function fetchLatestTrip() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "trips"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            setTrip({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
      } finally {
        setLoadingTrip(false);
      }
    }
    if (user) fetchLatestTrip();
  }, [user]);

  // --- ACTIONS ---

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleUpdateProfile = async () => {
    if (!user || !newName.trim()) return;
    setSavingProfile(true);
    try {
        await updateProfile(user, { displayName: newName });
        setSettingsOpen(false);
    } catch (error) {
        console.error("Update failed", error);
    } finally {
        setSavingProfile(false);
    }
  };

  const openWhatsApp = () => {
    const text = `Hi Latifa! I'm checking on my trip request (ID: ${trip?.id?.slice(0,6) || 'New'}).`;
    window.open(`https://wa.me/212600000000?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (authLoading || loadingTrip) return <Container sx={{ py: 10 }}><Skeleton variant="rectangular" height={400} /></Container>;

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
        
        {/* HEADER AREA */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
           <Typography variant="h5" fontWeight="bold">{t('header.title')}</Typography>
           <Button 
             startIcon={<SettingsIcon />} 
             variant="outlined" 
             onClick={() => setSettingsOpen(true)}
             sx={{ borderRadius: 50, textTransform: 'none' }}
           >
             {t('header.settings')}
           </Button>
        </Box>

        {/* --- CASE A: EMPTY STATE --- */}
        {!trip && (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, border: '2px dashed', borderColor: 'divider' }}>
                <AddLocationAltIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
                    {t('emptyState.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
                    {t('emptyState.subtitle')}
                </Typography>
                <Button variant="contained" onClick={() => router.push('/planning')} sx={{ mt: 2, borderRadius: 50, px: 6 }}>
                    {t('emptyState.button')}
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
                    {t('emptyState.note')}
                </Typography>
            </Paper>
        )}

        {/* --- CASE B: DASHBOARD --- */}
        {trip && (
            <>
            <Box sx={{ position: 'relative', height: 300, borderRadius: 6, overflow: 'hidden', mb: 6 }}>
                <Image src="https://images.unsplash.com/photo-1512958789358-4dac0c740dfb?q=80&w=2000&auto=format&fit=crop" alt="Morocco" fill style={{ objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)' }} />
                <Box sx={{ position: 'absolute', bottom: 40, left: 40, color: 'white' }}>
                    <Chip label={t('dashboard.statusPill')} color="warning" sx={{ mb: 2, fontWeight: 'bold', color: 'black', bgcolor: '#fbbf24' }} />
                    
                    {/* Rich text for Hero Title (allows line breaks) */}
                    <Typography variant="h3" fontWeight="900" fontFamily='"Playfair Display", serif'>
                        {t.rich('dashboard.heroTitle', { br: () => <br /> })}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                        {t('dashboard.heroDrafting')} {trip.destinations?.join(' & ')}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={6}>
                <Grid  size={{xs: 12, md: 8}}>
                    <Paper elevation={0} sx={{ p: 0 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{t('dashboard.designProgressTitle')}</Typography>
                        <KitchenTracker />
                    </Paper>
                    <PreferenceTuner />
                </Grid>

                {/* RIGHT SIDEBAR - CONCIERGE CARD */}
                <Grid  size={{xs: 12, md: 4}}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: 'white', position: 'sticky', top: 100 }}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Avatar src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" sx={{ width: 64, height: 64 }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">{t('concierge.name')}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block">{t('concierge.role')}</Typography>
                                <Chip label={t('concierge.status')} size="small" color="success" sx={{ height: 20, fontSize: '0.6rem' }} />
                            </Box>
                        </Stack>
                        
                        {/* Dynamic Greeting with Bold Travelers */}
                        <Typography variant="body2" color="text.secondary" paragraph>
                             {t.rich('concierge.greeting', { 
                                travelers: trip.travelers,
                                strong: (chunks) => <strong>{chunks}</strong>
                             })}
                        </Typography>
                        
                        <Button 
                            fullWidth variant="outlined" 
                            startIcon={<ChatBubbleOutlineIcon />} 
                            onClick={openWhatsApp} 
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            {t('concierge.button')}
                        </Button>
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}><VerifiedUserIcon color="action" fontSize="small" /><Typography variant="caption" color="text.secondary">{t('concierge.trust1')}</Typography></Stack>
                            <Stack direction="row" spacing={1} alignItems="center"><CheckCircleIcon color="action" fontSize="small" /><Typography variant="caption" color="text.secondary">{t('concierge.trust2')}</Typography></Stack>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            </>
        )}

        {/* --- SETTINGS DIALOG --- */}
        <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>{t('settings.title')}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} src={user?.photoURL || undefined} />
                        <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                    </Box>
                    <TextField 
                        label={t('settings.labelName')} 
                        fullWidth 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                <Button startIcon={<LogoutIcon />} color="error" onClick={handleLogout}>
                    {t('settings.logout')}
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={savingProfile ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                    onClick={handleUpdateProfile}
                    disabled={savingProfile}
                >
                    {savingProfile ? t('settings.saving') : t('settings.save')}
                </Button>
            </DialogActions>
        </Dialog>

    </Container>
  );
}