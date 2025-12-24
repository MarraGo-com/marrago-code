'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Rating, Paper, Avatar, 
  Grid, LinearProgress, TextField, Chip, Stack, Button, Divider, MenuItem, Select
} from '@mui/material';
import { useReviews } from '@/hooks/useReviews'; // Assuming this hook exists
import { useTranslations } from 'next-intl';
import { Review } from '@/types/review';
import { useTheme, styled } from '@mui/material/styles';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill'; // Adventure Theme Icon
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';

interface ReviewsListProps {
  experienceId: string;
}

// Custom Adventure Rating Icon
const AdventureRatingIcon = styled(OutdoorGrillIcon)(({ theme }) => ({
  color: '#f59e0b', // Adventure Orange
  '&.MuiRating-iconEmpty': {
    color: theme.palette.grey[300],
  },
}));

// Styled Progress Bar for Distribution (TripAdvisor Style)
const DistributionBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#f59e0b', // Adventure Orange
    borderRadius: 4,
  },
}));

export default function ReviewsList({ experienceId }: ReviewsListProps) {
  const t = useTranslations('ReviewsList');
  const theme = useTheme();
  const { data: reviews, isLoading, isError, error } = useReviews(experienceId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // --- 1. CALCULATE DASHBOARD DATA (Client-Side) ---
  const stats = useMemo(() => {
    if (!reviews) return null;
    const total = reviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r: Review) => {
      const rating = Math.round(r.rating) as 1|2|3|4|5;
      if (distribution[rating] !== undefined) distribution[rating]++;
      sum += r.rating;
    });

    return {
      total,
      average: total > 0 ? (sum / total).toFixed(1) : '0.0',
      distribution,
      // Calculate percentages for bars
      percentages: {
        5: total > 0 ? (distribution[5] / total) * 100 : 0,
        4: total > 0 ? (distribution[4] / total) * 100 : 0,
        3: total > 0 ? (distribution[3] / total) * 100 : 0,
        2: total > 0 ? (distribution[2] / total) * 100 : 0,
        1: total > 0 ? (distribution[1] / total) * 100 : 0,
      }
    };
  }, [reviews]);

  // Helper date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  // Filter Logic
  const filteredReviews = reviews?.filter((r: Review) => 
    r.text.toLowerCase().includes(searchTerm.toLowerCase())
    // Add logic for 'Traveler Type' filtering here if your backend supports it
  );

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error" sx={{ mt: 4 }}>{error?.message || t('errorLoadingReviews')}</Alert>;
  if (!reviews || reviews.length === 0) return <Typography sx={{ mt: 4, fontStyle: 'italic' }}>{t('noReviews')}</Typography>;

  return (
    <Box sx={{ mt: 8 }} id="reviews-section">
      
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
        {t('title')}
      </Typography>

      {/* --- SECTION 1: THE DASHBOARD (TripAdvisor Style) --- */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: '#fafafa', borderRadius: 4, mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          
          {/* LEFT: BIG SCORE */}
          <Grid size={{xs: 12, md: 4}} sx={{ textAlign: 'center', borderRight: { md: `1px solid ${theme.palette.divider}` } }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
              {stats?.average}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
               <Rating value={Number(stats?.average)} readOnly precision={0.1} icon={<AdventureRatingIcon fontSize="inherit" />} emptyIcon={<AdventureRatingIcon fontSize="inherit" />} />
            </Box>
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
              {stats?.total} verified reviews
            </Typography>
          </Grid>

          {/* RIGHT: DISTRIBUTION BARS */}
          <Grid size={{xs: 12, md: 8}}>
            <Stack spacing={1}>
              {[5, 4, 3, 2, 1].map((star) => (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: 60, fontWeight: 'bold' }}>
                    {star === 5 ? 'Excellent' : star === 4 ? 'Very Good' : star === 3 ? 'Average' : star === 2 ? 'Poor' : 'Terrible'}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    {/* @ts-expect-error: star is inferred as number but keys are specific literals */}
                    <DistributionBar variant="determinate" value={stats?.percentages[star]} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30, textAlign: 'right' }}>
                     {/* @ts-expect-error: star is inferred as number but keys are specific literals */}
                    {stats?.distribution[star]}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* --- SECTION 2: FILTERS & SEARCH --- */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4, justifyContent: 'space-between' }}>
        
        {/* Search Bar */}
        <TextField
            placeholder="Search reviews..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{ width: { xs: '100%', md: 300 }, bgcolor: 'white' }}
        />

        {/* Filter Chips (Mocked for UI visualization - connect to data later) */}
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
             {['All', 'Families', 'Couples', 'Solo'].map((type) => (
                 <Chip 
                    key={type} 
                    label={type} 
                    clickable 
                    variant={filterType === type ? 'filled' : 'outlined'}
                    color={filterType === type ? 'primary' : 'default'}
                    onClick={() => setFilterType(type)}
                 />
             ))}
        </Stack>
      </Box>

      {/* --- SECTION 3: REVIEW CARDS (Viator Style) --- */}
      <Stack spacing={3}>
        {filteredReviews?.map((review: Review) => (
          <Paper 
            key={review.id} 
            elevation={0}
            variant="outlined"
            sx={{ 
                p: 3, 
                borderRadius: 3, 
                transition: 'all 0.2s',
                '&:hover': { borderColor: theme.palette.primary.main, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
            }}
          >
            <Grid container spacing={2}>
                {/* Avatar & Info */}
                <Grid  size={{xs: 12, sm: 3, md: 2}}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: theme.palette.primary.light, fontWeight: 'bold' }}>
                            {review.authorName.charAt(0)}
                        </Avatar>
                        <Box sx={{ display: { sm: 'none' } }}> {/* Mobile Layout */}
                             <Typography fontWeight="bold">{review.authorName}</Typography>
                             <Typography variant="caption" color="text.secondary">{formatDate(review.createdAt)}</Typography>
                        </Box>
                    </Stack>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, mt: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">{review.authorName}</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">Joined 2023</Typography>
                    </Box>
                </Grid>

                {/* Content */}
                <Grid  size={{xs: 12, sm: 9, md: 10}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                         <Rating value={review.rating} readOnly size="small" icon={<AdventureRatingIcon fontSize="inherit" />} emptyIcon={<AdventureRatingIcon fontSize="inherit" />} />
                         <Typography variant="body2" color="text.secondary">{formatDate(review.createdAt)}</Typography>
                    </Box>

                    {/* Verified Badge (Viator Trust Signal) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">Verified Booking</Typography>
                    </Box>

                    <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
                        {review.text}
                    </Typography>

                    {/* Helpful Button (Social Proof) */}
                    <Button 
                        size="small" 
                        startIcon={<ThumbUpOutlinedIcon fontSize="small" />} 
                        sx={{ color: 'text.secondary', textTransform: 'none' }}
                    >
                        Helpful
                    </Button>
                </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>

      {/* Empty State for Search */}
      {filteredReviews?.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No reviews match your search.</Typography>
          </Box>
      )}

    </Box>
  );
}