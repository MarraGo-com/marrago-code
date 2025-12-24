'use client';

import React from 'react';
import { Paper, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import BookingForm from './BookingForm';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import { Experience } from '@/types/experience'; 

export interface BookingWidgetProps {
  experience: Experience;
  experienceId: string;
  experienceTitle: string;
}

export default function StickyBookingWidget({ experience, experienceId, experienceTitle }: BookingWidgetProps) {
  //const locale = useLocale();
  const t = useTranslations('ExperienceDetails'); 
  const tCommon = useTranslations('Common');

  // --- 1. DYNAMIC DATA CONSTRUCTION ---
  
  // Price Formatting
  const formattedPrice = experience.price?.amount 
    ? `${experience.price.prefix} ${experience.price.amount} ${experience.price.currency}`
    : t('stickyHeader.contactUs'); // Ensure this key exists

  // Duration: "3 Hours" / "3 Heures"
  const durationLabel = experience.durationValue && experience.durationUnit
    ? `${experience.durationValue} ${tCommon(`units.${experience.durationUnit}`, { count: experience.durationValue })}`
    : t('quickFacts.durationFallback', { default: 'Flexible' });

  // Group Size: "Up to 15 people"
  const groupSizeLabel = experience.maxGuests
    ? `${t('quickFacts.upTo')} ${experience.maxGuests} ${t('quickFacts.people', { count: experience.maxGuests })}`
    : t('quickFacts.privateGroup');

  // Languages: "English, French"
  const languagesLabel = experience.languages && experience.languages.length > 0
    ? experience.languages.map(code => tCommon(`languages.${code}`)).join(', ')
    : t('quickFacts.multilingual');

  return (
    <Paper 
      elevation={6}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        position: 'sticky',
        top: '100px', // Sticks to top while scrolling
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Typography variant="h4" component="p" sx={{ fontWeight: '800', color: 'primary.main' }}>
        {formattedPrice}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
        {t('mobileBar.perPerson')}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {/* --- 2. LOCALIZED QUICK LIST --- */}
      <List dense disablePadding>
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon sx={{ minWidth: '36px' }}>
            <AccessTimeIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText 
            primary={t('quickFacts.duration')} 
            secondary={durationLabel} 
            primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold', color: 'text.secondary' }}
            secondaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
          />
        </ListItem>
        
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon sx={{ minWidth: '36px' }}>
            <PeopleIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText 
            primary={t('quickFacts.maxGuests')} 
            secondary={groupSizeLabel}
            primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold', color: 'text.secondary' }}
            secondaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
          />
        </ListItem>
        
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon sx={{ minWidth: '36px' }}>
            <LanguageIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText 
            primary={t('quickFacts.languages')} 
            secondary={languagesLabel}
            primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold', color: 'text.secondary' }}
            secondaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
          />
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* --- 3. FULLY CONNECTED BOOKING FORM --- */}
      <BookingForm 
        experienceId={experienceId}
        experienceTitle={experienceTitle}
        price={experience.price}
        // Pass Strict Props for Logic
        maxGuests={experience.maxGuests}
        bookingPolicy={experience.bookingPolicy}
        spotsLeft={experience.scarcity?.spotsLeft}
      />
    </Paper>
  );
}