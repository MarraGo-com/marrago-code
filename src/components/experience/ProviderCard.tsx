'use client';

import React from 'react';
import { Box, Typography, Avatar, Button, Stack, Paper, Chip } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useTranslations } from 'next-intl';

interface ProviderCardProps {
  name?: string;
  rating?: number;
  reviewCount?: number;
  since?: string;
  // New Prop: Where should the button go? (Default: generic support email)
  contactHref?: string; 
}

export default function ProviderCard({ 
  name = "MarraGo Experiences", 
  rating = 4.9, 
  reviewCount = 1204, 
  since = "2023",
  // Default to a mailto link so it works immediately
  contactHref = "mailto:hello@marrago.com" 
}: ProviderCardProps) {
  
  const t = useTranslations('ExperienceDetails');

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        {t('provider.title')}
      </Typography>

      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 3,
          bgcolor: 'background.paper' // Ensures contrast in Dark Mode
        }}
      >
        {/* Avatar & Badge */}
        <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'primary.contrastText'
              }}
            >
              {name.charAt(0)}
            </Avatar>
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: -4, 
                right: -4, 
                bgcolor: 'background.paper', // Adaptive border color
                borderRadius: '50%', 
                p: 0.5,
                boxShadow: 1,
                display: 'flex'
              }}
            >
                <VerifiedUserIcon color="success" />
            </Box>
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
                {name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('provider.memberSince', { year: since })}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <Typography variant="body2" fontWeight="bold">{rating}</Typography>
                    <Typography variant="caption" color="text.secondary">({reviewCount})</Typography>
                </Stack>
                <Chip 
                  label={t('provider.verified')} 
                  size="small" 
                  variant="outlined" 
                  color="success"
                  sx={{ borderRadius: 1, height: 24, fontSize: '0.7rem', fontWeight: 600 }} 
                />
            </Stack>
        </Box>

        {/* Action Button */}
        <Button 
            component="a" // Render as an <a> tag
            href={contactHref}
            target="_blank" // Open in new tab (good for WhatsApp/Mail)
            variant="outlined" 
            startIcon={<ChatBubbleOutlineIcon />}
            sx={{ 
                borderRadius: 50, 
                textTransform: 'none', 
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                mt: { xs: 2, sm: 0 }, // Add space on mobile
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'text.primary'
                }
            }}
        >
            {t('provider.contact')}
        </Button>
      </Paper>
    </Box>
  );
}