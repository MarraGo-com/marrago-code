// src/themes/adventure/components/ReviewsList.tsx
'use client'; // This component remains a Client Component

import React from 'react';
import { Box, Typography, CircularProgress, Alert, Rating, Paper, Avatar } from '@mui/material';
import { useReviews } from '@/hooks/useReviews';
import { useTranslations } from 'next-intl';
import { Review } from '@/types/review';
import { useTheme, styled } from '@mui/material/styles'; // Import useTheme and styled
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill'; // For consistency with review form

interface ReviewsListProps {
  experienceId: string;
}

// Re-using the AdventureRatingIcon for consistency
const AdventureRatingIcon = styled(OutdoorGrillIcon)(({ theme }) => ({
  color: theme.palette.warning.light, // Brighter orange for active stars
  '&.MuiRating-iconEmpty': {
    color: theme.palette.grey[600], // Darker grey for empty stars
  },
}));

export default function ReviewsList({ experienceId }: ReviewsListProps) {
  const t = useTranslations('ReviewsList');
  const theme = useTheme(); // Access the current theme
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
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700, // Bolder title
          color: theme.palette.text.primary, // Strong primary text color
          textAlign: 'left',
          textTransform: 'uppercase', // Uppercase for impact
          letterSpacing: '0.05em', // Spaced out letters
          borderBottom: `2px solid ${theme.palette.primary.main}`, // Underline with primary color
          pb: 1, // Padding below underline
        }}
      >
        {t('title')}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" /> {/* Use primary theme color */}
        </Box>
      )}

      {isError && (
        <Alert severity="error">{error?.message || t('errorLoadingReviews')}</Alert>
      )}

      {reviews && reviews.length === 0 && (
        <Typography sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', p: 2 }}>
          {t('noReviews')}
        </Typography>
      )}

      {reviews && reviews.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}> {/* Increased gap */}
          {reviews.map((review: Review) => (
            <Paper
              key={review.id}
              elevation={4} // Higher elevation for more presence
              sx={{
                p: { xs: 3, sm: 4 }, // More padding
                bgcolor: theme.palette.background.paper, // Base background color
                borderRadius: 2, // Slightly rounded corners
                border: `1px solid ${theme.palette.divider}`, // Subtle border
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)', // Slight lift effect on hover
                  boxShadow: `0px 10px 25px rgba(0, 0, 0, 0.25)`, // More pronounced shadow on hover
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main, // Use secondary theme color for avatar
                    mr: 2,
                    width: 48, // Larger avatar
                    height: 48,
                    fontWeight: 700,
                  }}
                >
                  {review.authorName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary, // Stronger text color
                    }}
                  >
                    {review.authorName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Rating
                value={review.rating}
                readOnly
                sx={{ mb: 2 }}
                size="medium" // Medium size rating stars
                icon={<AdventureRatingIcon fontSize="inherit" />} // Custom icon
                emptyIcon={<AdventureRatingIcon fontSize="inherit" />} // Custom icon for empty state
              />
              <Typography variant="body1" sx={{ color: theme.palette.text.primary, lineHeight: 1.6 }}>
                {review.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}