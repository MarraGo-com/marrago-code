// /src/themes/default/reviews/LeaveReviewForm.tsx
'use client';

import React, { useState } from 'react';
import {Grid, Box, Typography, TextField, Button, Rating, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';

interface LeaveReviewFormProps {
  experienceId: string;
}

export default function LeaveReviewForm({ experienceId }: LeaveReviewFormProps) {
  const t = useTranslations('LeaveReviewForm');
  
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number | null>(4);
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
      setRating(4);
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
          p: { xs: 2, sm: 4 }, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 4 
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          {t('title')}
        </Typography>
        {/* 2. USE THE CORRECT Grid2 COMPONENT */}
        <Grid container spacing={2}>
          <Grid  size={{ xs: 12, sm: 6 }} >
            <TextField
              required
              fullWidth
              label={t('nameLabel')}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography component="legend" sx={{ mr: 2 }}>{t('ratingLabel')}:</Typography>
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
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label={t('reviewLabel')}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12}}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
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
