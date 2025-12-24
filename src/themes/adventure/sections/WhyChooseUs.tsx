'use client';

import React from 'react';
import { Grid, Box, Container, List, ListItem, ListItemIcon, ListItemText, Typography, Paper } from '@mui/material';
import Image from 'next/image';
import { useTranslations } from 'next-intl'; 

// --- ICONS THAT DRIVE CONVERSION ---
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; 
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; 
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; 

export default function WhyChooseUs() {
  const t = useTranslations('WhyChooseUs');

  // THE 3 PILLARS OF RISK REVERSAL
  const pillars = [
    {
      id: 'cancel',
      icon: <EventAvailableIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('pillar1Title'),
      description: t('pillar1Desc')
    },
    {
      id: 'payment',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('pillar2Title'),
      description: t('pillar2Desc')
    },
    {
      id: 'support',
      icon: <SupportAgentIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('pillar3Title'),
      description: t('pillar3Desc')
    }
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          
          {/* Left Column: Image with "Trust Badge" Overlay */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
              <Image
                src="/images/riad-marrakesh-coutyard.webp" 
                alt="Morocco Travel"
                fill
                loading='lazy'
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 90vw, 50vw"
              />
              
              {/* --- TRUST BADGE OVERLAY --- */}
              <Paper 
                elevation={4}
                sx={{ 
                    position: 'absolute', bottom: 24, left: 24, right: 24, 
                    p: 2, borderRadius: 3, 
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', gap: 2
                }}
              >
                 <Box sx={{ p: 1, borderRadius: '50%', color: 'primary.main' }}>
                    <VerifiedUserIcon />
                 </Box>
                 <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                        {t('trustBadgeTitle')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {t('trustBadgeDesc')}
                    </Typography>
                 </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column: The 3 Pillars */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1.2}>
                {t('subtitle')}
            </Typography>
            <Typography variant="h3" fontWeight="800" sx={{ mb: 6, mt: 1, fontFamily: '"Playfair Display", serif' }}>
                {t('title')}
            </Typography>
            
            <List sx={{ p: 0 }}>
              {pillars.map((feature, index) => (
                <ListItem key={index} disableGutters sx={{ mb: 4, alignItems: 'flex-start' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                        mr: 3, p: 1.5, minWidth: 60, height: 60, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '16px' 
                    }}
                  >
                    {feature.icon}
                  </Paper>
                  <ListItemText
                    primary={feature.title}
                    secondary={feature.description}
                    primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold', mb: 0.5 }}
                    secondaryTypographyProps={{ variant: 'body1', color: 'text.secondary', lineHeight: 1.6 }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}