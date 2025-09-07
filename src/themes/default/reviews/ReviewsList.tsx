// -------------------------------------------------------------------------
// 2. NEW FILE: /src/themes/default/reviews/ReviewsList.tsx
// This component uses the hook to display the reviews.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Alert, Rating, Paper, Avatar } from '@mui/material';
import { useReviews } from '@/hooks/useReviews';
import { useTranslations } from 'next-intl';
import { Review } from '@/types/review';

interface ReviewsListProps {
  experienceId: string;
}

export default function ReviewsList({ experienceId }: ReviewsListProps) {
  const t = useTranslations('ReviewsList');
  const { data: reviews, isLoading, isError, error } = useReviews(experienceId);

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
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

      {reviews && reviews.length === 0 && (
        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {t('noReviews')}
        </Typography>
      )}

      {reviews && reviews.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {reviews.map((review: Review) => (
            <Paper key={review.id} elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {review.authorName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>{review.authorName}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {review.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}