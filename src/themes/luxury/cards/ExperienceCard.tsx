// /src/themes/luxury/cards/ExperienceCard.tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { locations } from '@/config/locations';
import { Link } from '@/i18n/navigation';
import { Experience } from '@/types/experience';
import Image from 'next/image';

export interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const t_price = useTranslations('Price');
  const t_card = useTranslations('ExperienceCard');
  const locale = useLocale();
  const translation = experience.translations[locale as 'en' | 'fr' | 'ar'] || experience.translations.en;
  const location = locations.find(loc => loc.id === experience.locationId);
  const formattedPrice = experience.price?.amount ? `${t_price(experience.price.prefix)} ${experience.price.amount} ${experience.price.currency}` : t_price('contactUs');

  return (
    <Link href={`/experiences/${experience.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        className="group"
        sx={{
          width: '100%',
          textAlign: 'center', // Center all content
        }}
      >
        {/* Image with a subtle, elegant border */}
        <Box sx={{ 
          position: 'relative', 
          height: 320, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          p: '8px', // Padding creates an inner border effect
        }}>
          <Image
            src={experience.coverImage}
            loading='lazy'
            alt={translation?.title || ''}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw"
            className="transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        </Box>
        
        {/* Text content placed below the image with generous spacing */}
        <Box sx={{ pt: 3, px: 1 }}>
          {location && (
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>
              {location.name}
            </Typography>
          )}
          <Typography
            variant="h5"
            component="h3"
            sx={{
             // fontFamily: 'lora, serif',
              fontWeight: 500,
              lineHeight: 1.4,
              mb: 1.5,
            }}
          >
            {translation?.title}
          </Typography>
          <Typography variant="subtitle1" component="p" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {formattedPrice}
          </Typography>

          {/* Underline appears on hover for a subtle CTA */}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              position: 'relative',
              color: 'text.secondary',
              mt: 2,
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '0%',
                height: '1px',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'currentColor',
                transition: 'width 0.4s ease',
              },
              '.group:hover &::after': {
                width: '100%',
              },
            }}
          >
            {t_card('learnMoreButton')}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}