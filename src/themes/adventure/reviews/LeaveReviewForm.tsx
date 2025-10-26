//src/themes/adventure/reviews/LeaveReviewForm.tsx
// src/themes/adventure/components/LeaveReviewForm.tsx
'use client'; // This component remains a Client Component

import React, { useState } from 'react';
import {Grid, Box, Typography, TextField, Button, Rating, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles'; // Import useTheme to access theme palette
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill'; // A subtly adventurous icon for rating
import { styled } from '@mui/material/styles'; // For custom styling the rating icon

interface LeaveReviewFormProps {
  experienceId: string;
}

// Styled rating icon for an adventure feel
const AdventureRatingIcon = styled(OutdoorGrillIcon)(({ theme }) => ({
  color: theme.palette.warning.light, // Brighter orange for active stars
  '&.MuiRating-iconEmpty': {
    color: theme.palette.grey[600], // Darker grey for empty stars
  },
}));

export default function LeaveReviewForm({ experienceId }: LeaveReviewFormProps) {
  const t = useTranslations('LeaveReviewForm');
  const theme = useTheme(); // Access the current theme

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
          p: { xs: 3, sm: 5 }, // Slightly more padding for a substantial feel
          bgcolor: theme.palette.background.default, // Use a slightly off-white/grey default background from theme
          borderRadius: 3, // More rounded corners
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.2)', // Stronger, more defined shadow
          border: `1px solid ${theme.palette.divider}`, // Subtle border
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`, // Subtle gradient
          // Adventure-specific styles
          '&:hover': {
            boxShadow: '0px 12px 35px rgba(0, 0, 0, 0.3)', // Even stronger shadow on hover
            transform: 'translateY(-2px)', // Slight lift effect
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4, // More space below title
            fontWeight: 700, // Bolder title
            color: theme.palette.primary.main, // Use primary theme color for title
            textAlign: 'center', // Centered title
            textTransform: 'uppercase', // Uppercase for impact
            letterSpacing: '0.05em', // Spaced out letters
          }}
        >
          {t('title')}
        </Typography>

        <Grid container spacing={3}> {/* Increased spacing */}
          <Grid  size={{ xs: 12, sm: 6 }}> 
            <TextField
              required
              fullWidth
              label={t('nameLabel')}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              variant="outlined" // Explicitly use outlined variant
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2, // Slightly rounded input fields
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          </Grid>
          <Grid  size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography component="legend" sx={{ mr: 2, color: theme.palette.text.secondary }}>
                {t('ratingLabel')}:
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
                precision={0.5} // Allow half stars
                icon={<AdventureRatingIcon fontSize="inherit" />} // Use custom icon
                emptyIcon={<AdventureRatingIcon fontSize="inherit" />} // Use custom icon for empty state
              />
            </Box>
          </Grid>
          <Grid   size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label={t('reviewLabel')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined" // Explicitly use outlined variant
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12}}>
            <Button
              type="submit"
              variant="contained"
              color="primary" // Uses the primary color from the theme
              disabled={loading}
              fullWidth // Make button full width for mobile
              sx={{
                mt: 2, // Add some top margin to the button
                py: 1.5, // Taller button
                fontSize: '1.1rem', // Larger font size
                fontWeight: 700, // Bolder text
                borderRadius: '50px', // Pill-shaped button
                boxShadow: `0 6px 15px ${theme.palette.primary.dark}70`, // Stronger shadow from primary color
                '&:hover': {
                  transform: 'translateY(-3px)', // More pronounced lift on hover
                  boxShadow: `0 10px 20px ${theme.palette.primary.dark}90`, // Even stronger shadow
                  backgroundColor: theme.palette.primary.dark, // Darker primary on hover
                },
                transition: 'all 0.3s ease-in-out', // Smooth transitions
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('submitButton')}
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