// /src/themes/luxury/sections/WhyChooseUs.tsx (UPDATED)
'use client';

import React from 'react';
import { Grid, Box, Container, Typography } from '@mui/material';
// REMOVED: useTranslations is no longer needed
// import { useTranslations } from 'next-intl';

// NEW: Import client data and locale hook
import { useLocale } from 'next-intl';

// UPDATED: Using MainHeadingUserContent to accept a direct title string
import MainHeadingUserContent from '../../../components/custom/MainHeadingUserContent';

// Import icons from MUI (these remain hardcoded as they are not in the data file)
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { siteConfig } from '@/config/client-data';

// A small helper component for each feature item (structure remains the same)
const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  // Using the required size={{...}} prop
  <Grid size={{ xs: 12, md: 4 }}>
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ 
        mb: 3, 
        color: 'primary.main',
        '& .MuiSvgIcon-root': { fontSize: 48 } 
      }}>
        {icon}
      </Box>
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ fontWeight: 600, mb: 2 }}
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
            fontWeight: 500,
            mb: 10,
            color: 'text.primary'
          }}
        />

        {/* UPDATED: Dynamically mapping over features from the client data file */}
        <Grid container spacing={8}>
          {content.whyChooseUsFeatures.map((feature, index) => (
            <FeatureItem
              key={index}
              // Assign icon based on the order in the array
              icon={featureIcons[index % featureIcons.length]} 
              title={feature.title}
              description={feature.description}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}