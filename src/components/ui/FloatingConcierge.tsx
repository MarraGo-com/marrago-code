'use client';

import React, { useState } from 'react';
import { Box, Typography, Avatar, Paper, Slide, useTheme, useMediaQuery } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { siteConfig } from '@/config/client-data';
import { keyframes } from '@mui/system';

// --- 1. THE "PULSE" ANIMATION (Subtle Heartbeat) ---
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

export default function FloatingConcierge() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

  // --- CONFIGURATION ---
  // Use the founder's image to build extreme trust.
  const conciergeImage = "/images/marrago/ops-founder-male.webp"; 
  const conciergeName = "Omar";
  // Personalized message
  const welcomeMessage = "Salaam! I'm Omar. Ready to plan your trip?";
  
  // Pre-filled WhatsApp Message
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber?.replace(/\D/g, '')}?text=${encodeURIComponent("Hello Omar, I would like to plan a trip with MarraGo.")}`;

  const handleInteraction = () => {
    if (isMobile) {
        // On mobile: 1st tap opens bubble, 2nd tap goes to WhatsApp
        if (!isOpen) setIsOpen(true);
        else window.open(whatsappUrl, '_blank');
    } else {
        window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        // --- SMART POSITIONING ---
        // We lift it slightly higher on Desktop (40px) to clear the Footer's bottom copyright line
        bottom: { xs: 24, md: 40 },
        right: { xs: 24, md: 40 },
        zIndex: 9999, // Ensure it floats above everything
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
        pointerEvents: 'none', // Allows clicking "through" the empty space around the button
      }}
    >
      {/* 2. THE "SPEECH BUBBLE" (Appears on Hover or Click) */}
      <Slide direction="up" in={isHovered || isOpen} mountOnEnter unmountOnExit>
        <Paper
            elevation={6}
            onClick={() => window.open(whatsappUrl, '_blank')}
            sx={{
                pointerEvents: 'auto',
                bgcolor: 'white',
                color: 'text.primary',
                p: 2,
                borderRadius: 3,
                borderBottomRightRadius: 4, // Subtle "speech bubble" shape
                mb: 1,
                maxWidth: '280px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'transform 0.2s',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                '&:hover': { transform: 'translateY(-4px)' }
            }}
        >
             <Box 
                sx={{ 
                    bgcolor: 'rgba(37, 211, 102, 0.1)', 
                    p: 1, 
                    borderRadius: '50%',
                    display: 'flex',
                    color: '#25D366'
                }}
             >
                 <WhatsAppIcon />
             </Box>
             <Box>
                 <Typography variant="subtitle2" fontWeight="bold">
                     Chat with {conciergeName}
                 </Typography>
                 <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                     {welcomeMessage}
                 </Typography>
             </Box>
        </Paper>
      </Slide>

      {/* 3. THE TRIGGER (Avatar with Status Dot) */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleInteraction}
        sx={{
            pointerEvents: 'auto',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': { transform: 'scale(1.05)' }
        }}
      >
        {/* The "Online" Pulse Ring */}
        <Box
            sx={{
                position: 'absolute',
                top: 0, right: 0, bottom: 0, left: 0,
                borderRadius: '50%',
                animation: `${pulse} 2s infinite`,
                zIndex: 0
            }}
        />

        {/* The Avatar */}
        <Avatar
            src={conciergeImage}
            alt={conciergeName}
            sx={{
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                border: '3px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                bgcolor: 'primary.main',
                zIndex: 1
            }}
        >
            {/* Fallback Initial if image fails */}
            {conciergeName.charAt(0)}
        </Avatar>

        {/* The "Online" Green Dot */}
        <Box
            sx={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 16,
                height: 16,
                bgcolor: '#25D366', // WhatsApp Green
                border: '2px solid white',
                borderRadius: '50%',
                zIndex: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
        />
      </Box>
    </Box>
  );
}