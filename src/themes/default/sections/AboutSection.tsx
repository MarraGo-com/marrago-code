// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/components/sections/AboutSection.tsx
// This component is now upgraded with the new "Meet Our Team" section.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Paper, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
// Dynamically import the TeamMemberCard to optimize performance
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const TeamMemberCard = dynamic<TeamMemberCardProps>(() => import(`@/themes/${theme}/ui/TeamMemberCard`));

// Import some icons
import PublicIcon from '@mui/icons-material/Public';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SpaIcon from '@mui/icons-material/Spa';
import MainHeading from '../custom/MainHeading';
import ResponsiveHeading from '../custom/ResponsiveHeading';
import Image from 'next/image';
import { TeamMemberCardProps } from '../ui/TeamMemberCard';

export default function AboutSection() {
  const t = useTranslations('AboutSection');
  const aboutImageUrl = '/images/tagine-cooking2.webp';

  const values = [
    { icon: <PublicIcon fontSize="large" color="primary" />, title: t('value1_title'), description: t('value1_desc') },
    { icon: <HandshakeIcon fontSize="large" color="primary" />, title: t('value2_title'), description: t('value2_desc') },
    { icon: <SpaIcon fontSize="large" color="primary" />, title: t('value3_title'), description: t('value3_desc') },
  ];

  // Sample data for the new team section
  const teamMembers = [
    { image: '/images/hassan-al-fassi.webp', name: t('team1_name'), title: t('team1_title'), bio: t('team1_bio') },
    { image: '/images/fatim-zahra.webp', name: t('team2_name'), title: t('team2_title'), bio: t('team2_bio') },
    { image: '/images/youssef-adnani.webp', name: t('team3_name'), title: t('team3_title'), bio: t('team3_bio') },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* --- Part 1: The Story --- */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: { xs: 8, md: 12 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <MainHeading titleKey='title' t={t} sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}/>
              <Typography variant="h5" component="p" color="primary" sx={{ mb: 3 }}>
                {t('subtitle')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {t('paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('paragraph2')}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              maxWidth: 450,
              aspectRatio: '4/3',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              mx: { xs: 'auto', md: '0' },
              ml: { md: 'auto' }
            }}>
              <Image
                src={aboutImageUrl}
                alt={t('imageAlt')}
                fill
                loading='lazy'
                style={{ objectFit: 'cover' }}
                // --- THIS IS THE KEY FIX ---
                // This is a more accurate sizes prop for this specific layout.
                sizes="(max-width: 900px) 90vw, 450px"
              />
            </Box>
          </Grid>
        </Grid>

        {/* --- Part 2: Our Values --- */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <ResponsiveHeading component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                {t('valuesTitle')}
            </ResponsiveHeading>
            <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 6 }}>
                {t('valuesSubtitle')}
            </Typography>
            <Grid container spacing={4}>
                {values.map((value, index) => (
                    <Grid key={index} size={{ xs: 12, md: 4 }}>
                        <Box>
                            {value.icon}
                            <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2, color: 'text.primary' }}>
                                {value.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {value.description}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>

        {/* --- Part 3: NEW "Meet Our Team" Section --- */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                {t('teamTitle')}
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 6 }}>
                {t('teamSubtitle')}
            </Typography>
            <Grid container spacing={4}>
                {teamMembers.map((member, index) => (
                    <Grid key={index}  size={{ xs: 12, sm: 6, md: 4 }}>
                        <TeamMemberCard 
                            image={member.image}
                            name={member.name}
                            title={member.title}
                            bio={member.bio}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>

        {/* --- Part 4: Call to Action --- */}
        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                {t('ctaTitle')}
            </Typography>
            <Button component={Link} href="/contact" variant="contained" size="large">
                {t('ctaButton')}
            </Button>
        </Paper>

      </Container>
    </Box>
  );
}