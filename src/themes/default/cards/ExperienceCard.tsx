// /src/themes/default/cards/ExperienceCard.tsx
'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Divider, Button } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { Location, locations } from '@/config/locations';
import { Link } from '@/i18n/navigation';
import { Experience, Translation } from '@/types/experience';
import Image from 'next/image';
import { createSummary } from '@/lib/utils';
import { siteConfig } from '@/config/client-data';

export interface ExperienceCardProps {
  experience: Experience;
}
// --- ADD THIS TYPE DEFINITION ---
interface InternalCardProps {
  experience: Experience;
  translation: Translation; // Ideally, replace 'any' with your specific translation type
  location: Location | undefined;
  formattedPrice: string;
}
// --- Classic Card Style (Internal Component) ---
const ClassicCard = ({ experience, translation, location, formattedPrice }: InternalCardProps) => {
  const t_card = useTranslations('ExperienceCard');
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
          sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" 
          className="transition-transform duration-500 ease-in-out group-hover:scale-110" 
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {location && (<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{location.name}</Typography>)}
        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3, minHeight: '50px' }}>
          {translation?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {createSummary(translation?.description || '')}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="p" color="primary" sx={{ fontWeight: 'bold' }}>{formattedPrice}</Typography>
          <Button component={Link} href={`/experiences/${experience.id}`} size="small" variant="text">{t_card('learnMoreButton')}</Button>
      </CardActions>
    </Card>
  );
};

// --- Immersive Card Style (Internal Component) ---
const ImmersiveCard = ({ experience, translation, location, formattedPrice }: InternalCardProps) => {
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
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <Image 
          src={experience.coverImage} 
          loading='lazy' 
          alt={translation?.title || ''} 
          fill 
          style={{ objectFit: 'cover' }} 
          sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" 
          className="transition-transform duration-500 ease-in-out group-hover:scale-110" 
        />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
        {experience.tags && experience.tags.length > 0 && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 1, }}>
            {experience.tags[0]}
          </Box>
        )}
        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
            <Typography variant="h5" component="p" sx={{ color: 'white', fontWeight: 'bold' }}>{formattedPrice}</Typography>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {location && (<Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>{location.name}</Typography>)}
        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3 }}>
          {translation?.title}
        </Typography>
      </CardContent>
    </Card>
  );
};


// --- Main Exported Component ---
export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const t_price = useTranslations('Price');
  const locale = useLocale();
  const translation = experience.translations[locale as 'en' | 'fr' | 'ar'] || experience.translations.en || { title: '', description: '' } ;
  const location = locations.find(loc => loc.id === experience.locationId);
  const formattedPrice = experience.price?.amount ? `${t_price(experience.price.prefix)} ${experience.price.amount} ${experience.price.currency}` : t_price('contactUs');

  // Common props to pass to both card styles
  const cardProps = { experience, translation, location, formattedPrice };

  // Read the card style from a configuration file
  const cardStyle = siteConfig.theme.cardStyle; 

  if (cardStyle === 'classic') {
    return <ClassicCard {...cardProps} />;
  }

  // Default to immersive style
  return <ImmersiveCard {...cardProps} />;
}