// src/components/auth/SignupForm.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Stack, CircularProgress, Alert } from '@mui/material';
import { Link, useRouter } from '@/i18n/navigation';
import { Google } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, SignupFormValues } from '@/lib/validations/auth';
import { useTranslations } from 'next-intl'; 

// --- FIREBASE IMPORTS ---
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignupForm() {
  const t = useTranslations('Auth'); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema)
  });

  // --- A. EMAIL/PASSWORD SIGNUP ---
  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        
        await updateProfile(userCredential.user, {
            displayName: `${data.firstName} ${data.lastName}`
        });

        router.push('/'); 
    } catch (err: any) {
        console.error("Signup Error:", err);
        // Localized Error Messages
        if (err.code === 'auth/email-already-in-use') {
            setError(t('errors.emailInUse'));
        } else {
            setError(t('errors.generic'));
        }
    } finally {
        setLoading(false);
    }
  };

  // --- B. GOOGLE SIGNUP ---
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
           {t('signup.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
           {t('signup.subtitle')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Button 
          variant="outlined" fullWidth size="large" startIcon={<Google />} 
          onClick={handleGoogleLogin} 
          sx={{ mb: 4, py: 1.5, borderColor: 'divider', color: 'text.primary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
       >
         {t('common.googleBtnSignup')}
      </Button>

      <Divider sx={{ mb: 4, color: 'text.secondary', fontSize: '0.875rem' }}>
          {t('common.orEmail')}
      </Divider>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField 
                fullWidth label={t('common.firstName')} placeholder={t('common.placeholderName')} InputLabelProps={{ shrink: true }} 
                {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} disabled={loading}
            />
            <TextField 
                fullWidth label={t('common.lastName')} placeholder="Doe" InputLabelProps={{ shrink: true }} 
                {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} disabled={loading}
            />
         </Stack>
         
         <TextField 
            fullWidth label={t('common.emailLabel')} placeholder={t('common.placeholderEmail')} InputLabelProps={{ shrink: true }} sx={{ mb: 3 }}
            {...register('email')} error={!!errors.email} helperText={errors.email?.message} disabled={loading}
         />
         
         <TextField 
            fullWidth label={t('common.createPasswordLabel')} type="password" placeholder={t('common.placeholderPass')} 
            helperText={errors.password?.message || "Must be at least 8 characters"} InputLabelProps={{ shrink: true }} sx={{ mb: 3 }}
            {...register('password')} error={!!errors.password} disabled={loading}
         />
         
         {/* Rich Text for Terms & Privacy */}
         <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4, lineHeight: 1.5 }}>
            {t.rich('signup.terms', {
                terms: (chunks) => <Link href="/terms-of-use" style={{ color: 'inherit', textDecoration: 'underline' }}>{chunks}</Link>,
                privacy: (chunks) => <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>{chunks}</Link>
            })}
         </Typography>

         <Button 
           fullWidth type="submit" variant="contained" size="large" disabled={loading}
           sx={{ py: 1.8, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', textTransform: 'none', boxShadow: 2 }}
         >
           {loading ? <CircularProgress size={24} color="inherit" /> : t('signup.submit')}
         </Button>
      </Box>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
         <Typography variant="body2" color="text.secondary">
            {t('signup.footerText')}{' '}
            <Link href="/login" style={{ textDecoration: 'none', fontWeight: 700, color: '#1976d2' }}>
               {t('signup.footerLink')}
            </Link>
         </Typography>
      </Box>
    </Box>
  );
}