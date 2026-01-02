// src/components/auth/ClientLoginForm.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Stack, InputAdornment, Alert, CircularProgress, useTheme } from '@mui/material';
import { Link, useRouter } from '@/i18n/navigation';
import { Google, Email } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useTranslations } from 'next-intl';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 

export default function ClientLoginForm() {
  const t = useTranslations('Auth'); 
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        router.push('/'); 
    } catch (err: any) {
        console.error("Login Error:", err);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
             setError(t('errors.invalidCreds'));
        } else {
             setError(t('errors.generic'));
        }
    } finally {
        setLoading(false);
    }
  };

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
    <Box sx={{ width: '100%' }}> {/* Ensure full width of the container */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" gutterBottom sx={{ color: 'text.primary', letterSpacing: '-0.02em' }}>
           {t('login.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
           {t('login.subtitle')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Stack spacing={2} sx={{ mb: 4 }}>
         <Button 
           variant="outlined" 
           fullWidth 
           size="large" 
           startIcon={<Google />} 
           onClick={handleGoogleLogin}
           sx={{ 
             py: 1.8, 
             borderColor: 'rgba(255, 255, 255, 0.2)', 
             color: 'text.primary', 
             textTransform: 'none', 
             fontWeight: 600,
             fontSize: '1rem',
             '&:hover': { 
               borderColor: 'text.primary',
               bgcolor: 'rgba(255, 255, 255, 0.05)' 
             } 
           }}
         >
           {t('common.googleBtn')}
         </Button>
      </Stack>

      <Divider sx={{ mb: 4, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' }, color: 'text.secondary' }}>
          {t('common.or')}
      </Divider>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
         <TextField 
            fullWidth 
            label={t('common.emailLabel')} 
            placeholder={t('common.placeholderEmail')} 
            margin="normal" 
            InputLabelProps={{ shrink: true, style: { color: theme.palette.text.secondary } }}
            InputProps={{ 
              endAdornment: <InputAdornment position="end"><Email color="action" /></InputAdornment>,
              sx: { bgcolor: 'background.paper' } // Optional: slight highlight for input field
            }}
            {...register('email')} 
            error={!!errors.email} 
            helperText={errors.email?.message} 
            disabled={loading}
            sx={{ mb: 3 }}
         />

         <TextField 
            fullWidth 
            label={t('common.passwordLabel')} 
            type="password" 
            placeholder={t('common.placeholderPass')} 
            margin="normal" 
            InputLabelProps={{ shrink: true, style: { color: theme.palette.text.secondary } }}
            InputProps={{ sx: { bgcolor: 'background.paper' } }}
            {...register('password')} 
            error={!!errors.password} 
            helperText={errors.password?.message} 
            disabled={loading}
         />
         
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 4 }}>
            <Link href="/forgot-password" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, color: theme.palette.primary.main }}>
               {t('login.forgotPassword')}
            </Link>
         </Box>

         <Button 
           fullWidth 
           type="submit" 
           variant="contained" 
           size="large" 
           disabled={loading}
           sx={{ 
             py: 1.8, 
             borderRadius: 2, 
             fontWeight: 'bold', 
             fontSize: '1.1rem', 
             textTransform: 'none', 
             bgcolor: 'primary.main',
             color: '#fff', // Force white text on primary button
             '&:hover': { bgcolor: 'primary.dark' }
           }}
         >
           {loading ? <CircularProgress size={24} color="inherit" /> : t('login.submit')}
         </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
         <Typography variant="body2" color="text.secondary">
            {t('login.footerText')}{' '}
            <Link href="/signup" style={{ textDecoration: 'none', fontWeight: 700, color: theme.palette.primary.main }}>
               {t('login.footerLink')}
            </Link>
         </Typography>
      </Box>
    </Box>
  );
}