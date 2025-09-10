// /src/themes/luxury/reviews/ReviewsList.tsx
'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Alert, Rating, Avatar, Grid, Divider } from '@mui/material';
import { useReviews } from '@/hooks/useReviews';
import { useTranslations } from 'next-intl';
import { Review } from '@/types/review';

export interface ReviewsListProps {
  experienceId: string;
}

export default function ReviewsList({ experienceId }: ReviewsListProps) {
  const t = useTranslations('ReviewsList');
  const { data: reviews, isLoading, isError, error } = useReviews(experienceId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold' 
          // This will automatically inherit the theme's heading font
        }}
      >
        {t('title')}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">{error.message}</Alert>
      )}

      {reviews && reviews.length === 0 && !isLoading && (
        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {t('noReviews')}
        </Typography>
      )}

      {reviews && reviews.length > 0 && (
        // --- THIS IS THE KEY CHANGE: A clean, list-style layout ---
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {reviews.map((review: Review) => (
            <Box key={review.id}>
              <Grid container spacing={3}>
                {/* Left Column: Author Info */}
                <Grid  size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      alt={review.authorName}
                      // Use the avatar if provided in your data, otherwise use initial
                      // src={review.avatar || undefined} 
                      sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}
                    >
                      {review.authorName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold' }}>{review.authorName}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Right Column: Rating and Text */}
                <Grid  size={{xs: 12, sm: 9}}>
                  <Rating value={review.rating} readOnly sx={{ mb: 1.5 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {review.text}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 5 }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}