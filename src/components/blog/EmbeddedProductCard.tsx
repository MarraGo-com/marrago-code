'use client';

import React from 'react';
import { Box, Typography, Button, Paper, Rating, Chip, Stack, useTheme } from '@mui/material';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface EmbeddedProductCardProps {
  title: string;
  image: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  duration?: string;
  link: string;
  badge?: string; // e.g., "Best Seller" or "Reader's Choice"
}

export default function EmbeddedProductCard({
  title,
  image,
  price,
  rating = 4.8,
  reviewCount = 120,
  duration = '6-8 hours',
  link,
  badge
}: EmbeddedProductCardProps) {
  const theme = useTheme();

  return (
    <Paper 
      elevation={3}
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on desktop
        overflow: 'hidden', 
        borderRadius: 4, 
        my: 6, // Margin top/bottom to separate from text
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      {/* 1. IMAGE SECTION */}
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '40%' }, height: { xs: 200, sm: 'auto' }, minHeight: 200 }}>
        <Image 
          src={image} 
          alt={title} 
          fill 
          style={{ objectFit: 'cover' }} 
        />
        {badge && (
          <Chip 
            label={badge} 
            color="secondary" 
            size="small" 
            sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 'bold' }} 
          />
        )}
      </Box>

      {/* 2. CONTENT SECTION */}
      <Box sx={{ p: 3, width: { xs: '100%', sm: '60%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Trust Signal */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <VerifiedUserIcon color="primary" sx={{ fontSize: 16 }} />
            <Typography variant="caption" color="primary" fontWeight="bold">
                VERIFIED EXPERIENCE
            </Typography>
        </Stack>

        <Typography variant="h5" component="h3" fontWeight="800" sx={{ mb: 1, lineHeight: 1.2 }}>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({reviewCount})
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">{duration}</Typography>
            </Box>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
            <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                    From
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                    €{price}
                </Typography>
            </Box>

            <Button 
                component={Link} 
                href={link} 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 50, px: 3, fontWeight: 'bold', textTransform: 'none' }}
            >
                Check Availability
            </Button>
        </Box>
      </Box>
    </Paper>
  );
}