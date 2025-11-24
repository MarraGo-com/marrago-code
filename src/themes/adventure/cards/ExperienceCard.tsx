// /src/themes/adventure/cards/ExperienceCard.tsx
'use client';

import React from 'react';
import { 
  Card, CardContent, CardMedia, Typography, Button, Box, Chip, Stack, useTheme 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
  const { title, shortDescription, description } = experience.translations[locale] || experience.translations.en;
  
  const locationName = locations.find(loc => loc.id === experience.locationId)?.name || experience.locationId;

  // --- Competitor Style Colors ---
  const accentColor = '#FF5722'; // A vibrant orange for icons
  const buttonColor = theme.palette.primary.main; // Use your brand's primary color

  // --- WhatsApp & Phone Links ---
  // Replace with your actual business numbers
  const whatsappNumber = '212600000000'; 
  const phoneNumber = '+212600000000';
  
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://wa.me/${whatsappNumber}?text=I'm interested in the ${title} tour`, '_blank');
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px', // More rounded corners
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', // Softer, more modern shadow
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
      },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* --- Duration Chip (Competitor Style) --- */}
      <Chip
        label={experience.duration}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          // ▼▼▼ FIX: FORCE DARK COLOR FOR CONTRAST ▼▼▼
          color: '#222222', 
          // ▲▲▲
          fontWeight: 'bold',
          borderRadius: '20px', // Pill shape
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          px: 1,
          backdropFilter: 'blur(4px)'
        }}
      />

      <CardMedia
        component="img"
        // Make image slightly taller for more impact
        height="260"
        image={experience.coverImage}
        alt={title}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
          '&:hover': {
            transform: 'scale(1.05)' // Subtle zoom effect on hover
          }
        }}
      />
      
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 3,
        pb: 2
      }}>
        {/* --- Title --- */}
        <Typography variant="h6" component="h3" fontWeight="800" gutterBottom sx={{ 
          lineHeight: 1.3,
          mb: 1,
          // Limit to 2 lines for consistency
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}>
          {title}
        </Typography>

        {/* --- Short Description --- */}
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2.5,
          // Limit to 3 lines
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          flexGrow: 1 // Push subsequent content down
        }}>
          {/* Use the new shortDescription, fallback to full description if not set */}
          {shortDescription || description}
        </Typography>

        {/* --- Location & Duration Icons --- */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <LocationOnIcon sx={{ color: accentColor }} />
            <Typography variant="body2" fontWeight="500">
              {locationName}, Morocco
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AccessTimeIcon sx={{ color: accentColor }} />
            <Typography variant="body2" fontWeight="500">
              Duration: {experience.duration}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          {/* --- Quick Contact Links --- */}
          <Stack direction="row" justifyContent="space-around" sx={{ mb: 2 }}>
            <Button
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppClick}
              sx={{ 
                color: '#25D366', // WhatsApp green
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.08)' }
               }}
            >
              WhatsApp
            </Button>
            <Button
              startIcon={<PhoneIcon />}
              onClick={handlePhoneClick}
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { bgcolor: `${theme.palette.primary.main}14` }
               }}
            >
              Call
            </Button>
          </Stack>

          {/* --- Main "Book Now" Button --- */}
          <Button
            component={Link}
            href={`/experiences/${experience.id}`}
            variant="contained"
            fullWidth
            size="large"
            startIcon={<CalendarMonthIcon />}
            sx={{
              borderRadius: '12px', // Rounded button
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              bgcolor: buttonColor,
              boxShadow: `0 4px 14px ${buttonColor}66`, // Colored shadow
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                boxShadow: `0 6px 20px ${buttonColor}88`,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {/* You'll need to update your en.json for this key, or hardcode "Book Now" for a quick test */}
            {t('bookNowButton') || "Book Now"} 
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;