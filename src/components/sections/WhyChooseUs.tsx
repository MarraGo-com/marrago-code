// /src/components/sections/WhyChooseUs.tsx
'use client'; // <-- Must be a client component to use the hook

import React from 'react';
import {Grid, Box, Container } from '@mui/material';
import FeatureCard from '../ui/FeatureCard';
import { useTranslations } from 'next-intl'; // <-- Import the hook

// Import icons from MUI
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MainHeading from '../custom/MainHeading';

export default function WhyChooseUs() {
  const t = useTranslations('WhyChooseUs'); // <-- Initialize the hook

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <MainHeading 
         titleKey='title' 
         component={'h2'}
         variant='h2'
         t={t} 
         sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 8, 
            color: 'text.primary'
          }}        />

        <Grid container spacing={4}>
          {/* We pass the translated text as props to the FeatureCard component */}
          <Grid  size={{ xs: 12, md: 4 }}>
            <FeatureCard
              icon={<MapIcon />}
              title={t('feature1_title')}
              description={t('feature1_desc')}
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard
              icon={<EditNoteIcon />}
              title={t('feature2_title')}
              description={t('feature2_desc')}
            />
          </Grid>
          
          <Grid  size={{ xs: 12, md: 4 }}>
            <FeatureCard
              icon={<SupportAgentIcon />}
              title={t('feature3_title')}
              description={t('feature3_desc')}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}