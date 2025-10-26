// /src/themes/luxury/sections/NewsletterSection.tsx (UPDATED)
'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, CircularProgress, Alert } from '@mui/material';
// Kept for UI-specific text like placeholders and errors
import { useTranslations } from 'next-intl'; 
// NEW: Import client data and locale hook for main content
import { useLocale } from 'next-intl';

// UPDATED: Use MainHeadingUserContent for direct title prop
import MainHeadingUserContent from '../../../components/custom/MainHeadingUserContent';
import EastIcon from '@mui/icons-material/East';
import { siteConfig } from '@/config/client-data';

export default function NewsletterSection() {
  // `t` is still used for UI text (placeholder, errors)
  const t = useTranslations('Newsletter'); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // NEW: Get content for title and subtitle
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || t('errorGeneric'));
      }

      setStatus({ type: 'success', message: result.message });
      setEmail('');

    } catch (err: unknown) {
      if (err instanceof Error) { 
        setStatus({ type: 'error', message: err.message });
      } else {
        setStatus({ type: 'error', message: t('errorGeneric') });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.900', color: 'white' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          {/* UPDATED: MainHeadingUserContent now gets title from client data */}
          <MainHeadingUserContent 
            title={content.newsletterTitle}
            variant="h2"
            component="h2"
            sx={{ 
              fontWeight: 500,
              mb: 2 
            }}
          />
          {/* UPDATED: Typography now gets subtitle from client data */}
          <Typography sx={{ color: 'grey.400', mb: 5, maxWidth: '500px', mx: 'auto' }}>
            {content.newsletterSubtitle}
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.700' }}>
              <TextField
                required
                fullWidth
                placeholder={t('emailLabel')} // Kept using `t` for placeholder
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { 
                    color: 'white', 
                    fontSize: '1.2rem',
                    '::placeholder': {
                      color: 'grey.500',
                    }
                  }
                }}
              />
              <Button
                type="submit"
                variant="text"
                disabled={loading}
                sx={{ p: 1, minWidth: 'auto' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : <EastIcon sx={{ color: 'white' }} />}
              </Button>
            </Box>
          </Box>
          {status && (
            <Alert 
              severity={status.type} 
              sx={{ 
                mt: 3, 
                justifyContent: 'center',
                color: status.type === 'success' ? 'text.primary' : 'inherit',
                bgcolor: status.type === 'success' ? 'success.light' : 'error.light',
              }}
            >
              {status.message}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
}