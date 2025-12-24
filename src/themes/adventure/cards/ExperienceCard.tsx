'use client';

import React from 'react';
import { 
  Card, CardContent, CardMedia, Typography, Button, Box, Chip, Stack, useTheme, IconButton, Tooltip 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Experience } from '@/types/experience';
import { useLocale, useTranslations } from 'next-intl';
import { locations } from '@/config/locations';
import Link from 'next/link';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const theme = useTheme();
  const locale = useLocale();
  const t = useTranslations('ExperienceCard');
  // 1. Initialize Common translations for units (Hours/Days)
  const tCommon = useTranslations('Common');
  
  // Safe Translation Access
  const translation = experience.translations?.[locale] || experience.translations?.en || {};
  const title = translation.title || 'Untitled Experience';
  const shortDescription = translation.shortDescription || translation.description || '';
  
  const locationName = locations.find(loc => loc.id === experience.locationId)?.name || experience.locationId;

  // --- DATA ---
  const isLikelyToSellOut = experience.scarcity?.isLikelyToSellOut;
  const rating = experience.rating || 0;
  const reviewCount = experience.reviewCount || 0;
  const price = experience.price || { amount: 0, currency: 'EUR', prefix: '€' };

  // 2. DYNAMIC DURATION LOGIC
  const durationLabel = experience.durationValue && experience.durationUnit
    ? `${experience.durationValue} ${tCommon(`units.${experience.durationUnit}`, { count: experience.durationValue })}`
    : t('durationFallback', { default: 'Flexible' }); // Ensure this key exists or fallback to text

  // Contact Info
  const whatsappNumber = '212600000000'; 
  const phoneNumber = '+212600000000';
  
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    window.open(`https://wa.me/${whatsappNumber}?text=I'm interested in ${title}`, '_blank');
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px',
      // Theme-aware shadows
      boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'background.paper'
    }}>
      
      {/* 1. SCARCITY BADGE */}
      {isLikelyToSellOut && (
        <Chip 
            label={t('likelyToSellOut')} 
            size="small" 
            icon={<BoltIcon sx={{ color: 'white !important', fontSize: '14px' }} />}
            sx={{ 
                position: 'absolute', top: 12, left: 12, zIndex: 10,
                bgcolor: '#e11d48', // Keep red for urgency
                color: 'white', fontWeight: 'bold', 
                fontSize: '0.7rem', height: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }} 
        />
      )}

      {/* 2. DURATION CHIP (Fixed) */}
      <Chip
        label={durationLabel}
        icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
        size="small"
        sx={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          // Dark Mode Fix: Use theme background instead of hardcoded white
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)',
          color: 'text.primary',
          fontWeight: 'bold', backdropFilter: 'blur(4px)'
        }}
      />

      <Link href={`/experiences/${experience.id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
            component="img"
            height="240"
            image={experience.coverImage}
            alt={title}
            sx={{ objectFit: 'cover' }}
        />
      </Link>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, pb: 2 }}>
        
        {/* RATING ROW */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
            {rating > 0 ? (
                <>
                    <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                    <Typography variant="body2" fontWeight="bold">{rating}</Typography>
                    <Typography variant="caption" color="text.secondary">({reviewCount})</Typography>
                </>
            ) : (
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {t('newActivity')}
                </Typography>
            )}
            <Typography variant="caption" color="text.disabled"> • </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{locationName}</Typography>
            </Stack>
        </Stack>

        {/* Title */}
        <Typography 
            component={Link} 
            href={`/experiences/${experience.id}`}
            variant="subtitle1" 
            fontWeight="800" 
            sx={{ 
                lineHeight: 1.3, mb: 1, minHeight: '2.6em',
                display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
                textDecoration: 'none', color: 'text.primary',
                '&:hover': { color: 'primary.main' }
            }}
        >
          {title}
        </Typography>

        {/* Short Desc */}
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, flexGrow: 1
        }}>
          {shortDescription}
        </Typography>

        {/* HYBRID FOOTER */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="caption" display="block" color="text.secondary">
                        {t('from')}
                    </Typography>
                    <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ lineHeight: 1 }}>
                        {price.prefix} {price.amount} {price.currency}
                    </Typography>
                </Box>
                
                <Stack direction="row" spacing={1}>
                    <Tooltip title={t('callUs')}>
                        <IconButton size="small" onClick={handlePhoneClick} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <PhoneIcon fontSize="small" color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('chatWhatsApp')}>
                        <IconButton size="small" onClick={handleWhatsAppClick} sx={{ border: '1px solid', borderColor: 'divider', color: '#25D366' }}>
                            <WhatsAppIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <Button
                component={Link}
                href={`/experiences/${experience.id}`}
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={{
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: theme.shadows[2]
                }}
            >
                {t('viewDetails')}
            </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default ExperienceCard;