'use client';

import React from 'react';
import { Fab, Tooltip, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/client-data';

/**
 * A reusable floating WhatsApp button that pulls the phone number
 * from the central siteConfig. It only renders if a number is provided.
 */
export default function FloatingWhatsApp() {
  const t = useTranslations('Footer'); // Or a new 'WhatsApp' namespace
  
  const { whatsappNumber } = siteConfig.contact;

  // If no WhatsApp number is provided in the siteConfig,
  // do not render the component.
  if (!whatsappNumber) {
    return null;
  }

  // Generate the clean, international WhatsApp URL
  const whatsAppUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 24, md: 32 }, // Position from bottom
        right: { xs: 24, md: 32 },  // Position from right
        zIndex: (theme) => theme.zIndex.fab, // Ensure it's on top
      }}
    >
      <Tooltip title={t('contactUsTitle') || "Contact us on WhatsApp"} arrow>
        <Fab
          color="primary" // Use the theme's primary color
          aria-label="Chat on WhatsApp"
          component="a" // Render as a link
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            // Use a bright green for WhatsApp brand color
            bgcolor: '#25D366', 
            color: 'white',
            '&:hover': {
              bgcolor: '#128C7E', // Darker green on hover
            },
          }}
        >
          <WhatsAppIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}