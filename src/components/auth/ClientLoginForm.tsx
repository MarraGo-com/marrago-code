// src/components/auth/ClientLoginForm.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Stack, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { Link, useRouter } from '@/i18n/navigation';
import { Google, Email } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useTranslations } from 'next-intl';

// --- FIREBASE IMPORTS ---
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 

export default function ClientLoginForm() {
  const t = useTranslations('Auth'); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
  });

  // --- A. EMAIL LOGIN ---
  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        router.push('/'); // Redirect on success
    } catch (err: any) {
        console.error("Login Error:", err);
        // Localized Error Messages
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
             setError(t('errors.invalidCreds'));
        } else {
             setError(t('errors.generic'));
        }
    } finally {
        setLoading(false);
    }
  };

  // --- B. GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.push('/');
    } catch (err) {
        console.error("Google Auth Error", err);
        setError(t('errors.googleFailed'));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: 'text.primary' }}>
           {t('login.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
           {t('login.subtitle')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Stack spacing={2} sx={{ mb: 4 }}>
         <Button 
           variant="outlined" fullWidth size="large" startIcon={<Google />} 
           onClick={handleGoogleLogin}
           sx={{ py: 1.5, borderColor: 'divider', color: 'text.primary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
         >
           {t('common.googleBtn')}
         </Button>
      </Stack>

      <Divider sx={{ mb: 4, color: 'text.secondary', fontSize: '0.875rem' }}>
          {t('common.or')}
      </Divider>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
         <TextField 
            fullWidth 
            label={t('common.emailLabel')} 
            placeholder={t('common.placeholderEmail')} 
            margin="normal" InputLabelProps={{ shrink: true }}
            InputProps={{ endAdornment: <InputAdornment position="end"><Email color="action" /></InputAdornment> }}
            {...register('email')} error={!!errors.email} helperText={errors.email?.message} disabled={loading}
            sx={{ mb: 2 }}
         />

         <TextField 
            fullWidth 
            label={t('common.passwordLabel')} 
            type="password" 
            placeholder={t('common.placeholderPass')} 
            margin="normal" InputLabelProps={{ shrink: true }}
            {...register('password')} error={!!errors.password} helperText={errors.password?.message} disabled={loading}
         />
         
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 4 }}>
            <Link href="/forgot-password" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, color: '#ff9800' }}>
               {t('login.forgotPassword')}
            </Link>
         </Box>

         <Button 
           fullWidth type="submit" variant="contained" size="large" disabled={loading}
           sx={{ py: 1.8, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', textTransform: 'none', boxShadow: 2 }}
         >
           {loading ? <CircularProgress size={24} color="inherit" /> : t('login.submit')}
         </Button>
      </Box>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
         <Typography variant="body2" color="text.secondary">
            {t('login.footerText')}{' '}
            <Link href="/signup" style={{ textDecoration: 'none', fontWeight: 700, color: '#1976d2' }}>
               {t('login.footerLink')}
            </Link>
         </Typography>
      </Box>
    </Box>
  );
}