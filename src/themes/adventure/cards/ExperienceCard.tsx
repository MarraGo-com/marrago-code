// /src/themes/adventure/cards/ExperienceCard.tsx
'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Rating, Chip } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { locations } from '@/config/locations';
import { Link } from '@/i18n/navigation';
import { Experience} from '@/types/experience';
import Image from 'next/image';

// This is the single, bold card style for the Adventure theme.
export interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const t_price = useTranslations('Price');
  const locale = useLocale();
  const translation = experience.translations[locale as 'en' | 'fr' | 'ar'] || experience.translations.en || { title: '', description: '' };
  const location = locations.find(loc => loc.id === experience.locationId);
  const formattedPrice = experience.price?.amount ? `${t_price(experience.price.prefix)} ${experience.price.amount} ${experience.price.currency}` : t_price('contactUs');

  return (
    <Card 
      component={Link}
      href={`/experiences/${experience.id}`}
      className="group"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        textDecoration: 'none',
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
        }
      }}
    >
      <CardMedia sx={{ position: 'relative', height: 220 }}>
        <Image 
          src={experience.coverImage} 
          loading='lazy' 
          alt={translation?.title || ''} 
          fill 
          style={{ objectFit: 'cover' }} 
          sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" 
          className="transition-transform duration-500 ease-in-out group-hover:scale-105" 
        />
        {/* Tag for "New", "Best Seller", etc. */}
        {experience.tags && experience.tags.length > 0 && (
          <Chip 
            label={experience.tags[0]} 
            color="primary" 
            size="small"
            sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 'bold', zIndex: 1 }}
          />
        )}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {location && (
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                {location.name}
            </Typography>
        )}
        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.4, flexGrow: 1 }}>
          {translation?.title}
        </Typography>

        {/* Rating and Duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1, color: 'text.secondary' }}>
            <Rating name="read-only" value={experience.rating || 4.5} readOnly precision={0.5} size="small" />
            <Typography variant="body2">({experience.reviewCount || 0} reviews)</Typography>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
                {experience.duration}
            </Typography>
            <Typography variant="h5" component="p" color="primary" sx={{ fontWeight: 'bold' }}>
                {formattedPrice}
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};