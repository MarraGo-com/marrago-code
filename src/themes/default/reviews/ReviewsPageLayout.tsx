// src/themes/default/reviews/ReviewsPageLayout.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Review } from '@/types/review'; // <-- Import type

// Props are passed from the server page
export default function ReviewsPageLayout({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('ReviewsPage');
  
  // NO DATA FETCHING (useEffect/useState) NEEDED

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          {t('reviewsTitleDefault')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 6 }}>
          This is the **DEFAULT** Reviews Page Layout.
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {reviews.map((review) => (
            <Paper key={review.id} elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                {review.author}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Rating: {review.rating} / 5
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "{review.text}" {/* Use direct data, not translation key */}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}