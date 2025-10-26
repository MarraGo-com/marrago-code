// /src/themes/adventure/sections/WhyChooseUs.tsx (UPDATED)
'use client';

import React from 'react';
import { Grid, Box, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Image from 'next/image';
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
    <MapIcon key="map" color="primary" />,
    <EditNoteIcon key="edit" color="primary" />,
    <SupportAgentIcon key="support" color="primary" />,
  ];


  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          {/* Left Column: Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}>
              <Image
                src="/images/4x4-sahara-night.webp"
                alt={content.whyChooseUsTitle} // UPDATED
                fill
                loading='lazy'
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 90vw, 50vw"
              />
            </Box>
          </Grid>

          {/* Right Column: Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* UPDATED: Using MainHeadingUserContent and passing the direct title */}
            <MainHeadingUserContent 
              title={content.whyChooseUsTitle}
              component={'h2'}
              variant='h2'
              sx={{ 
                textAlign: { xs: 'center', md: 'left' }, 
                fontWeight: 'bold', 
                textTransform: 'uppercase',
                mb: 4, 
              }}
            />
            
            <List sx={{ p: 0 }}>
              {/* UPDATED: Dynamically mapping over features from the client data file */}
              {content.whyChooseUsFeatures.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {/* Clone the icon from our array to apply custom styles */}
                    {React.cloneElement(featureIcons[index % featureIcons.length], { sx: { fontSize: 32 } })}
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