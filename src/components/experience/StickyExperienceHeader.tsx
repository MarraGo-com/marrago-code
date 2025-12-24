'use client';

import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Slide, useScrollTrigger, Container, Stack, useTheme, useMediaQuery, Chip 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { useTranslations } from 'next-intl';

interface StickyExperienceHeaderProps {
  title: string;
  price: { amount: number; currency: string; prefix: string };
  rating?: number;
  reviewCount?: number;
  onBook: () => void;
}

export default function StickyExperienceHeader({ title, price, rating = 0, reviewCount = 0, onBook }: StickyExperienceHeaderProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // We use keys from both namespaces to avoid duplication
  const t = useTranslations('ExperienceDetails.stickyHeader'); 
  const tCard = useTranslations('ExperienceCard'); 

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 600, 
  });

  if (!isDesktop) return null;

  return (
    <Slide appear={false} direction="down" in={trigger}>
      <AppBar 
        position="fixed" 
        elevation={4} 
        sx={{ 
          bgcolor: 'background.paper', // Dark mode friendly
          color: 'text.primary',
          top: 0, 
          zIndex: 1100,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { md: 70 }, justifyContent: 'space-between', py: 1 }}>
            
            {/* LEFT: Title & Social Proof */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>
                    {title}
                </Typography>
                
                {/* LOGIC: Show Stars if Rated, otherwise show "New" Badge */}
                {rating > 0 ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {rating}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ({reviewCount})
                        </Typography>
                    </Stack>
                ) : (
                    <Stack direction="row" alignItems="center" spacing={1}>
                       <Chip 
                         label={tCard('newActivity')} // Reusing "New Activity" key
                         size="small" 
                         color="primary" 
                         variant="outlined"
                         icon={<FiberNewIcon />}
                         sx={{ 
                           height: 20, 
                           fontSize: '0.7rem', 
                           fontWeight: 'bold', 
                           border: '1px solid',
                           borderColor: theme.palette.divider
                         }} 
                       />
                       <Typography variant="caption" color="text.secondary">
                           {/* Fallback text or add specific key if needed */}
                           --
                       </Typography>
                    </Stack>
                )}
            </Box>

            {/* RIGHT: Price & CTA */}
            <Stack direction="row" alignItems="center" spacing={3}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                        {t('from')}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: 'primary.main' }}>
                        {price.prefix} {price.amount} {price.currency}
                    </Typography>
                </Box>

                <Button 
                    variant="contained" 
                    onClick={onBook}
                    sx={{ 
                        borderRadius: 50,
                        px: 3,
                        py: 1,
                        fontWeight: 800,
                        textTransform: 'none',
                        boxShadow: theme.shadows[3]
                    }}
                >
                    {t('bookNow')}
                </Button>
            </Stack>

          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
}