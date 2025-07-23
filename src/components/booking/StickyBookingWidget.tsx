// -------------------------------------------------------------------------
// UPDATED FILE: /src/components/booking/StickyBookingWidget.tsx
// This component now correctly passes the 'price' prop to the BookingForm.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Paper, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslations } from 'next-intl';
import BookingForm from './BookingForm';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import { Experience } from '@/types/experience'; // Import the full Experience type

// The props should accept the full experience object for flexibility
interface BookingWidgetProps {
  experience: Experience;
  experienceId: string;
  experienceTitle: string;
}

export default function StickyBookingWidget({ experience, experienceId, experienceTitle }: BookingWidgetProps) {
  const t_price = useTranslations('Price');
  
  const formattedPrice = experience.price?.amount 
    ? `${t_price(experience.price.prefix)} ${experience.price.amount} ${experience.price.currency}`
    : t_price('contactUs');

  return (
    <Paper 
      elevation={6}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        position: 'sticky',
        top: '100px',
      }}
    >
      <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
        {formattedPrice}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        per person
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List dense>
        <ListItem disablePadding>
          <ListItemIcon sx={{minWidth: '40px'}}><AccessTimeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Duration" secondary={experience.duration} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon sx={{minWidth: '40px'}}><PeopleIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Group Size" secondary="Up to 8 people" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon sx={{minWidth: '40px'}}><LanguageIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Languages" secondary="English, French" />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      
      {/* --- THIS IS THE KEY FIX --- */}
      {/* We now correctly pass the 'price' object from the experience prop down to the BookingForm */}
      <BookingForm 
        experienceId={experienceId}
        experienceTitle={experienceTitle}
        price={experience.price}
      />
    </Paper>
  );
}
