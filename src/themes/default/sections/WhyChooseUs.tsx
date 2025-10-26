// /src/components/sections/WhyChooseUs.tsx (UPDATED)
'use client'; 

import React from 'react';
import { Grid, Box, Container } from '@mui/material';
import FeatureCard from '../ui/FeatureCard';
// REMOVED: useTranslations is no longer needed
// import { useTranslations } from 'next-intl';

// NEW: Import client data and locale hook
import { useLocale } from 'next-intl';

// UPDATED: Using MainHeadingUserContent to accept a direct title string

// Import icons from MUI (these remain hardcoded)
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { siteConfig } from '@/config/client-data';

export default function WhyChooseUs() {
  // REMOVED: const t = useTranslations('WhyChooseUs');

  // NEW: Get content dynamically based on the current locale
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  // An array of icons to map to the features from the data file by index
  const featureIcons = [
    <MapIcon key="map" />,
    <EditNoteIcon key="edit" />,
    <SupportAgentIcon key="support" />,
  ];

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        {/* UPDATED: Using MainHeadingUserContent and passing the direct title */}
        <MainHeadingUserContent
          title={content.whyChooseUsTitle}
          component={'h2'}
          variant='h2'
          sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 8, 
            color: 'text.primary'
          }}
        />

        <Grid container spacing={4}>
          {/* UPDATED: Dynamically mapping over features from the client data file */}
          {content.whyChooseUsFeatures.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <FeatureCard
                // Assign icon based on the order in the array
                icon={featureIcons[index % featureIcons.length]} 
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}