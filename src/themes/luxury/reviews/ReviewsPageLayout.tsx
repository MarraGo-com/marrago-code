// src/themes/luxury/reviews/ReviewsPageLayout.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Review } from '@/types/review'; // <-- Import type

export default function ReviewsPageLayout({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('ReviewsPage');

  // NO DATA FETCHING (useEffect/useState) NEEDED

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0d1117', color: '#f0f6fc' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#E0B64D' }}>
          {t('reviewsTitleLuxury')}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 6, color: '#d3d3d3' }}>
          Discerning voices from our **LUXURY** journeys.
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {reviews.map((review) => (
            <Paper key={review.id} variant="outlined" sx={{ p: 4, mb: 4, bgcolor: '#161b22', borderColor: '#30363d', borderRadius: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#E0B64D' }}>
                {review.author}
              </Typography>
              <Typography variant="body2" sx={{ color: '#a8b3cf', mb: 2 }}>
                {review.rating} out of 5 Stars
              </Typography>
              <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', my: 2 }} />
              <Typography variant="body1" sx={{ color: '#f0f6fc', fontStyle: 'italic' }}>
                "{review.comment}" {/* Use direct data */}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}