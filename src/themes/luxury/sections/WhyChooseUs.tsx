// /src/themes/luxury/sections/WhyChooseUs.tsx
'use client';

import React from 'react';
import { Grid, Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import MainHeading from '../../default/custom/MainHeading';

// Import icons from MUI
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EditNoteIcon from '@mui/icons-material/EditNote';

// A small helper component for each feature item
const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Grid  size={{ xs: 12, md: 4 }}>
    <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
        mb: 3, 
        color: 'primary.main',
        // This sets the font size for the icon inside
        '& .MuiSvgIcon-root': { fontSize: 48 } 
      }}>
        {icon}
      </Box>
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
         // fontFamily: 'lora, serif', 
          fontWeight: 600, 
          mb: 2 
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Grid>
);


export default function WhyChooseUs() {
  const t = useTranslations('WhyChooseUs');

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      bgcolor: 'background.default' // Clean white background
    }}>
      <Container maxWidth="lg">
        <MainHeading 
         titleKey='title' 
         component={'h2'}
         variant='h2'
         t={t} 
         sx={{ 
           textAlign: 'center', 
          // fontFamily: 'lora, serif',
           fontWeight: 500,
           mb: 10, // Increased margin for more space
           color: 'text.primary'
         }}
        />

        {/* --- THIS IS THE KEY CHANGE --- */}
        {/* We use a new, more elegant layout instead of the FeatureCard component */}
        <Grid container spacing={8}>
          <FeatureItem
            icon={<MapIcon />}
            title={t('feature1_title')}
            description={t('feature1_desc')}
          />
          <FeatureItem
            icon={<EditNoteIcon />}
            title={t('feature2_title')}
            description={t('feature2_desc')}
          />
          <FeatureItem
            icon={<SupportAgentIcon />}
            title={t('feature3_title')}
            description={t('feature3_desc')}
          />
        </Grid>
      </Container>
    </Box>
  );
}