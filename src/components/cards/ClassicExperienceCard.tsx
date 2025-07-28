// -------------------------------------------------------------------------
// 4. NEW FILE: /src/components/cards/ClassicExperienceCard.tsx
// This is our new, clean "classic e-commerce" card design.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Divider, Button } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { locations } from '@/config/locations';
import { Link } from '@/i18n/navigation';
import { Experience } from '@/types/experience';
import Image from 'next/image';
import { createSummary } from '@/lib/utils';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ClassicExperienceCard({ experience }: ExperienceCardProps) {
  const t_price = useTranslations('Price');
  const t_card = useTranslations('ExperienceCard');
  const locale = useLocale();
  const translation = experience.translations[locale as 'en' | 'fr'] || experience.translations.en;
  const location = locations.find(loc => loc.id === experience.locationId);
  const formattedPrice = experience.price?.amount ? `${t_price(experience.price.prefix)} ${experience.price.amount} ${experience.price.currency}` : t_price('contactUs');

  return (
    <Card 
      className="group"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <Image 
           src={experience.coverImage}  
           alt={translation?.title || ''} 
           fill 
           loading='lazy'
           style={{ objectFit: 'cover' }} 
           sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" 
           className="transition-transform duration-500 ease-in-out group-hover:scale-110" 
           />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {location && (<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{location.name}</Typography>)}
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3, minHeight: '50px' }}>
          {translation?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {createSummary(translation?.description || '')}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{formattedPrice}</Typography>
          <Button component={Link} href={`/experiences/${experience.id}`} size="small" variant="text">{t_card('learnMoreButton')}</Button>
      </CardActions>
    </Card>
  );
}