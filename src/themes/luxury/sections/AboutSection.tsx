// /src/themes/luxury/sections/AboutSection.tsx
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import MainHeading from '../../default/custom/MainHeading';
import Image from 'next/image';

// --- Import icons for the "Values" section ---
import PublicIcon from '@mui/icons-material/Public';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SpaIcon from '@mui/icons-material/Spa';
import { TeamMemberCardProps } from '../ui/TeamMemberCard';

// --- Dynamically import the new luxury TeamMemberCard ---
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const TeamMemberCard = dynamic<TeamMemberCardProps>(() => import(`@/themes/${theme}/ui/TeamMemberCard`));

export default function AboutSection() {
  const t = useTranslations('AboutSection');
  const aboutImageUrl = '/images/tagine-cooking2.webp';

  const values = [
    { icon: <PublicIcon fontSize="large" color="primary" />, title: t('value1_title'), description: t('value1_desc') },
    { icon: <HandshakeIcon fontSize="large" color="primary" />, title: t('value2_title'), description: t('value2_desc') },
    { icon: <SpaIcon fontSize="large" color="primary" />, title: t('value3_title'), description: t('value3_desc') },
  ];

  const teamMembers = [
    { image: '/images/hassan-al-fassi.webp', name: t('team1_name'), title: t('team1_title'), bio: t('team1_bio') },
    { image: '/images/fatim-zahra.webp', name: t('team2_name'), title: t('team2_title'), bio: t('team2_bio') },
    { image: '/images/youssef-adnani.webp', name: t('team3_name'), title: t('team3_title'), bio: t('team3_bio') },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* --- Part 1: The Story (New Editorial Layout) --- */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid  size={{xs: 12, md: 6}}>
            <Box sx={{ pr: { md: 6 } }}>
              <MainHeading 
                titleKey='title' 
                t={t} 
                sx={{ 
                   // fontFamily: '"Oranienbaum", serif',
                    fontWeight: 400, 
                    mb: 3, 
                    color: 'text.primary',
                    textAlign: { xs: 'center', md: 'left' } 
                }}
              />
              <Typography variant="h5" component="p" color="primary" sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                {t('subtitle')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.8 }}>
                {t('paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {t('paragraph2')}
              </Typography>
            </Box>
          </Grid>
          <Grid  size={{xs: 12, md: 6}}>
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              maxWidth: 500,
              borderRadius: '50%', // Circular image
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              mx: 'auto',
            }}>
              <Image
                src={aboutImageUrl}
                alt={t('imageAlt')}
                fill
                loading='lazy'
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 90vw, 500px"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- Part 2: Our Values (Contrasting Background) --- */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <MainHeading 
                titleKey='valuesTitle' 
                t={t}
                sx={{ fontWeight: 400, color: 'text.primary', mb: 3 }}
            />
            <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 8 }}>
                {t('valuesSubtitle')}
            </Typography>
            <Grid container spacing={5}>
              {values.map((value) => (
                <Grid  size={{xs: 12, md: 4}} key={value.title}>
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
        </Container>
      </Box>

      {/* --- Part 3: Meet Our Team --- */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <MainHeading 
                titleKey='teamTitle'
                t={t} 
                sx={{fontWeight: 400, color: 'text.primary', mb: 3 }}
          />
          <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 8 }}>
            {t('teamSubtitle')}
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid  size={{xs: 12, sm: 6, md: 4}} key={index}>
                <TeamMemberCard 
                  image={member.image}
                  name={member.name}
                  title={member.title}
                />
              </Grid>
            ))}
          </Grid>
      </Container>
      
      {/* --- Part 4: Call to Action (Full width, high contrast) --- */}
      <Box sx={{ py: { xs: 8, md: 10 }, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <MainHeading 
                titleKey='ctaTitle' 
                t={t}
                variant="h3"
                sx={{ fontWeight: 400, mb: 4 }}
          />
          <Button 
            component={Link} 
            href="/contact" 
            variant="outlined" 
            size="large"
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            {t('ctaButton')}
          </Button>
      </Box>
    </Box>
  );
}