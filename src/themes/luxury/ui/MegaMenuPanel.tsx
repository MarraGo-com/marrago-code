'use client';
// /src/themes/luxury/ui/MegaMenuPanel.tsx

import React from 'react';
import { Box, Typography, Grid, Divider, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { locations } from '@/config/locations';
import AnimatedLink from './AnimatedLink';
import Image from 'next/image'; // Import next/image

export default function MegaMenuPanel() {
  const t = useTranslations('MegaMenu');
  const theme = useTheme();

  const travelStyles = [
    { name: t('styleAdventure'), href: '/experiences?style=adventure' },
    { name: t('styleCultural'), href: '/experiences?style=cultural' },
    { name: t('styleRelaxation'), href: '/experiences?style=relaxation' },
    { name: t('styleFamily'), href: '/experiences?style=family' },
  ];

  const featuredTour = {
    title: t('featuredTitle'),
    image: '/images/4x4-sahara.webp',
    href: '/experiences/3tIyqvneqdbExbm0Ys94',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(28, 28, 30, 0.8)'
            : 'rgba(94, 92, 92, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        zIndex: 1300,
      }}
    >
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Column 1: Destinations */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              {t('destinationsTitle')}
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              {locations.map((location) => (
                <AnimatedLink key={location.id} href={`/experiences?location=${location.id}`}>
                  {location.name}
                </AnimatedLink>
              ))}
            </Box>
          </Grid>

          {/* Column 2: Travel Styles */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              {t('stylesTitle')}
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              {travelStyles.map((style) => (
                <AnimatedLink key={style.name} href={style.href}>
                  {style.name}
                </AnimatedLink>
              ))}
            </Box>
          </Grid>

          {/* Divider */}
          <Grid size= {{md:1}} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
             <Divider orientation="vertical" />
          </Grid>

          {/* Column 3: Featured Tour */}
          <Grid size={{ xs: 12, md: 5 }}>
             <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
               {t('featuredTitle')}
             </Typography>
             <Card component={Link} href={featuredTour.href} elevation={0} sx={{ mt: 2, textDecoration: 'none', backgroundColor: 'transparent' }}>
               {/* --- Image Implementation --- */}
              <Box sx={{ position: 'relative', width: '100%', height: '140px', borderRadius: 1, overflow: 'hidden' }}>
                 <Image
                   src={featuredTour.image}
                   alt={featuredTour.title}
                   fill
                   loading='lazy'
                   style={{ objectFit: 'cover' }}
                   // --- THIS IS THE KEY FIX ---
                   // This tells the browser the image will be at most around 400px wide.
                   sizes="(max-width: 900px) 90vw, 400px"
                 />
               </Box>
               {/* --- End Image Implementation --- */}
               <CardContent sx={{ p: '8px 0 0 0' }}>
                 <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                   {featuredTour.title}
                 </Typography>
               </CardContent>
             </Card>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}