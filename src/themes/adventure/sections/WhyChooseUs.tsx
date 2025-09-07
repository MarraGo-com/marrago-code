// /src/themes/adventure/sections/WhyChooseUs.tsx
'use client';

import React from 'react';
import { Grid, Box, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Import icons from MUI
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MainHeading from '../../default/custom/MainHeading';

export default function WhyChooseUs() {
  const t = useTranslations('WhyChooseUs');

  const features = [
    { icon: <MapIcon color="primary" />, title: t('feature1_title'), description: t('feature1_desc') },
    { icon: <EditNoteIcon color="primary" />, title: t('feature2_title'), description: t('feature2_desc') },
    { icon: <SupportAgentIcon color="primary" />, title: t('feature3_title'), description: t('feature3_desc') },
  ];

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        {/* --- THIS IS THE KEY CHANGE: A dynamic, asymmetrical layout --- */}
        <Grid container spacing={8} alignItems="center">
          {/* Left Column: Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/5', // A taller aspect ratio for a more dramatic effect
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}>
                <Image
                    src="/images/4x4-sahara-night.webp" // A more adventurous image
                    alt={t('title')}
                    fill
                    loading='lazy'
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 900px) 90vw, 50vw"
                />
            </Box>
          </Grid>

          {/* Right Column: Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MainHeading 
              titleKey='title' 
              component={'h2'}
              variant='h2'
              t={t} 
              sx={{ 
                textAlign: { xs: 'center', md: 'left' }, 
                fontWeight: 'bold', 
                textTransform: 'uppercase', // Bold, uppercase heading
                mb: 4, 
              }}
            />
            
            <List sx={{ p: 0 }}>
              {features.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.title}
                    secondary={feature.description}
                    primaryTypographyProps={{ variant: 'h6', component: 'h3', fontWeight: 'bold', mb: 1 }}
                    secondaryTypographyProps={{ variant: 'body1', color: 'text.secondary' }}
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