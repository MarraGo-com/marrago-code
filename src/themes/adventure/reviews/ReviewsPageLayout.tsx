// src/themes/adventure/reviews/ReviewsPageLayout.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Avatar } from '@mui/material';
import { useTranslations } from 'next-intl';
import StarIcon from '@mui/icons-material/Star';
import { Review } from '@/types/review'; // <-- Import type

export default function ReviewsPageLayout({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('ReviewsPage');

  // NO DATA FETCHING (useEffect/useState) NEEDED

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F9FBE7' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#689F38' }}>
          {t('reviewsTitleAdventure')}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 6, color: '#8BC34A' }}>
          See what our adventurers say! This is the **ADVENTURE** Reviews Layout.
        </Typography>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {reviews.map((review) => (
            <Paper key={review.id} elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3, borderLeft: '5px solid #FFB300' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#689F38', mr: 2 }}>{review.avatar || review.author}</Avatar>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#558B2F' }}>
                  {review.author}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} sx={{ color: '#FFC107' }} />
                ))}
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                "{review.comment}" {/* Use direct data */}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}