// /src/themes/adventure/reviews/TestimonialCard.tsx
'use client';

import React from 'react';
import { Paper, Box, Typography, Avatar, Rating } from '@mui/material';
import { Review } from '@/types/review';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface TestimonialCardProps {
  review: Review;
}

export default function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <Paper 
      elevation={4}
      sx={{ 
        p: 3, 
        height: '100%', 
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 40, mb: 2 }} />
      <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', flexGrow: 1, mb: 2 }}>
        &quot;{review.text}&quot;
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
        <Avatar 
          alt={review.authorName} 
          src={review.avatar || undefined}
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <Box>
          <Typography sx={{ fontWeight: 'bold' }}>{review.authorName}</Typography>
          <Rating value={review.rating} readOnly size="small" />
        </Box>
      </Box>
    </Paper>
  );
}