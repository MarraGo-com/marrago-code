// /src/components/experience/HelpBox.tsx
'use client';

import React from 'react';
import { Paper, Typography, Button, Stack, useTheme } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
// ▼▼▼ NEW IMPORT ▼▼▼
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/client-data';

// Placeholder contact data. In a real app, this would come from a config file or database.
const CONTACT_PHONE = siteConfig.contact.phone;
const WHATSAPP_NUMBER = siteConfig.contact.whatsappNumber;

export default function HelpBox() {
  const theme = useTheme();
  // ▼▼▼ GET TRANSLATIONS ▼▼▼
  const t = useTranslations('ExperienceDetailsNew');

  const handleWhatsAppClick = () => {
    // Open WhatsApp Web or App with a pre-filled message
    const message = encodeURIComponent("Hello, I have a question about a tour I found on your website.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 3, 
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        textAlign: 'center'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2, color: theme.palette.primary.main }}>
        <PhoneInTalkIcon fontSize="large" />
        <Typography variant="h6" fontWeight="bold">
          {/* ▼▼▼ TRANSLATED ▼▼▼ */}
          {t('helpBoxTitle')}
        </Typography>
      </Stack>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {/* ▼▼▼ TRANSLATED ▼▼▼ */}
        {t('helpBoxText')}
      </Typography>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PhoneInTalkIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
        {CONTACT_PHONE}
      </Typography>

      <Button 
        variant="contained" 
        color="success" // Use 'success' color for WhatsApp green
        fullWidth
        size="large"
        startIcon={<WhatsAppIcon />}
        onClick={handleWhatsAppClick}
        sx={{ 
          borderRadius: '50px',
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          py: 1.5,
          boxShadow: theme.shadows[4]
        }}
      >
        {/* ▼▼▼ TRANSLATED ▼▼▼ */}
        {t('whatsappButton')}
      </Button>
    </Paper>
  );
}