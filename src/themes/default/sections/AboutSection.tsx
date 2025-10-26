'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Paper, Button } from '@mui/material';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import Image from 'next/image';

// --- Data Imports ---
import { siteConfig } from '@/config/client-data';

// --- Icon Imports ---
import PublicIcon from '@mui/icons-material/Public';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SpaIcon from '@mui/icons-material/Spa';

// --- Dynamic Component Imports ---
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
import { TeamMemberCardProps } from '../ui/TeamMemberCard'; 
const TeamMemberCard = dynamic<TeamMemberCardProps>(() => import(`@/themes/${theme}/ui/TeamMemberCard`));
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import ResponsiveHeading from '../custom/ResponsiveHeading';
import { AboutPageContent } from '@/config/types';

// --- Static Data ---
const aboutImageUrl = siteConfig.aboutUsContent.imageUrl;
const ctaLink = '/contact';
const valueIcons = [
  <PublicIcon key="public" fontSize="large" color="primary" />,
  <HandshakeIcon key="handshake" fontSize="large" color="primary" />,
  <SpaIcon key="spa" fontSize="large" color="primary" />,
];

// --- Sub-components for Organization ---

const StorySection = ({ content }: { content: AboutPageContent }) => (
  <Grid container spacing={6} alignItems="center" sx={{ mb: { xs: 8, md: 12 } }}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <MainHeadingUserContent title={content.title} sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}/>
        {/* INTEGRATED: Slogan from siteConfig */}
        {siteConfig.slogan && (
            <Typography variant="h5" component="p" color="primary" sx={{ mb: 3, fontWeight: 500 }}>
                {siteConfig.slogan}
            </Typography>
        )}
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          {content.paragraph1}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {content.paragraph2}
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
          alt={content.title} 
          fill
          loading='lazy'
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 900px) 90vw, 450px"
        />
      </Box>
    </Grid>
  </Grid>
);

const ValuesSection = ({ content }: { content: AboutPageContent }) => (
  <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
    <ResponsiveHeading component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
      {content.valuesTitle}
    </ResponsiveHeading>
    <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 6 }}>
      {content.valuesSubtitle}
    </Typography>
    <Grid container spacing={4}>
      {content.values.map((value, index) => (
        <Grid key={index} size={{ xs: 12, md: 4 }}>
          <Box>
            {valueIcons[index % valueIcons.length]}
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
);

const TeamSection = ({ content }: { content: AboutPageContent }) => (
  <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
      {content.teamTitle}
    </Typography>
    <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 6 }}>
      {content.teamSubtitle}
    </Typography>
    <Grid container spacing={4}>
      {content.teamMembers.map((member, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
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
);

const CtaSection = ({ content }: { content: AboutPageContent }) => (
  <Paper elevation={6} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
      {content.ctaTitle}
    </Typography>
    <Button component={Link} href={ctaLink} variant="contained" size="large">
      {content.ctaButtonText}
    </Button>
  </Paper>
);

// --- Main AboutSection Component ---

export default function AboutSection() {
  const locale = useLocale() as 'en' | 'fr' | 'ar'; 
  const content: AboutPageContent = siteConfig.textContent[locale]?.aboutPage || siteConfig.textContent.en.aboutPage;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <StorySection content={content} />
        <ValuesSection content={content} />
        <TeamSection content={content} />
        <CtaSection content={content} />
      </Container>
    </Box>
  );
}
