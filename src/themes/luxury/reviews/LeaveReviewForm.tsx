// /src/themes/luxury/reviews/LeaveReviewForm.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Rating, CircularProgress, Alert, Snackbar, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';

export interface LeaveReviewFormProps {
  experienceId: string;
}

export default function LeaveReviewForm({ experienceId }: LeaveReviewFormProps) {
  const t = useTranslations('LeaveReviewForm');
  
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number | null>(5); // Default to 5 stars for a luxury feel
  const [text, setText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCloseSnackbar = () => {
    setFormStatus(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating) {
      setFormStatus({ type: 'error', message: t('errorRating') });
      return;
    }
    setLoading(true);
    setFormStatus(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId,
          authorName,
          rating,
          text,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || t('errorGeneric'));
      }

      setFormStatus({ type: 'success', message: t('successMessage') });
      setAuthorName('');
      setRating(5);
      setText('');

    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormStatus({ type: 'error', message: err.message });
      } else {
        setFormStatus({ type: 'error', message: t('errorGeneric') });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          mt: 8, 
          // --- THIS IS THE KEY CHANGE: No paper/card background ---
          // The form now sits directly on the page for a more integrated feel
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            textAlign: 'center'
            // This will automatically inherit the theme's heading font
          }}
        >
          {t('title')}
        </Typography>
        <Grid container spacing={3}>
          <Grid  size={{ xs: 12, sm: 6 }} >
            <TextField
              required
              fullWidth
              label={t('nameLabel')}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              variant="filled" // A more elegant input style
            />
          </Grid>
          <Grid  size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
              <Typography component="legend" sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>{t('ratingLabel')}:</Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
              />
            </Box>
          </Grid>
          <Grid  size={{ xs: 12}}>
            <TextField
              required
              fullWidth
              multiline
              rows={5}
              label={t('reviewLabel')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="filled"
            />
          </Grid>
          <Grid  size={{ xs: 12}} sx={{ textAlign: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading} 
              size="large"
              sx={{ minWidth: '200px' }}
            >
              {loading ? <CircularProgress size={24} /> : t('submitButton')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar
        open={formStatus !== null}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={formStatus?.type} sx={{ width: '100%' }}>
          {formStatus?.message}
        </Alert>
      </Snackbar>
    </>
  );
}