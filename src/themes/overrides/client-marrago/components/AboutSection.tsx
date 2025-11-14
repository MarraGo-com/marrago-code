'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Paper, Button } from '@mui/material';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// --- Data Imports ---
import { siteConfig } from '@/config/client-data';

// --- Icon Imports ---
import ExploreIcon from '@mui/icons-material/Explore';
import MountainFlagIcon from '@mui/icons-material/Terrain';
import NatureIcon from '@mui/icons-material/LocalFlorist';

// --- Dynamic Component Imports ---
import { AboutPageContent } from '@/config/types';
import { TeamMemberCardProps } from '@/themes/adventure/ui/TeamMemberCard';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const TeamMemberCard = dynamic<TeamMemberCardProps>(() => import(`@/themes/${theme}/ui/TeamMemberCard`));

// --- Static Data ---
const aboutImageUrl = '/images/sahara-expedition-sunset.webp';
const ctaLink = '/contact';
const valueIcons = [
    <ExploreIcon key="explore" fontSize="large" color="secondary" />,
    <MountainFlagIcon key="mountain" fontSize="large" color="secondary" />,
    <NatureIcon key="nature" fontSize="large" color="secondary" />,
];

// --- Sub-components for Organization ---

const StorySection = ({ content }: { content: AboutPageContent }) => (
    <Grid container spacing={6} alignItems="center" sx={{ mb: { xs: 8, md: 12 } }}>
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <MainHeadingUserContent
                    title={content.title}
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: 'text.primary',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
                {/* INTEGRATED: Slogan from siteConfig */}
                {siteConfig.slogan && (
                    <Typography variant="h5" component="p" color="secondary.main" sx={{ mb: 3, fontWeight: 600 }}>
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
                position: 'relative', width: '100%', maxWidth: 500,
                aspectRatio: '4/3', borderRadius: 2, overflow: 'hidden',
                boxShadow: '0 12px 24px rgba(0,0,0,0.3), inset 0 0 15px rgba(255,255,255,0.2)',
                border: '3px solid', borderColor: 'primary.dark',
                mx: 'auto', transform: 'rotate(2deg)',
                '&:hover': { transform: 'rotate(0deg) scale(1.02)', boxShadow: '0 15px 30px rgba(0,0,0,0.4)', transition: '0.3s' }
            }}>
                <Image
                    src={aboutImageUrl}
                    alt={content.title}
                    fill
                    loading='lazy'
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 900px) 90vw, 500px"
                />
            </Box>
        </Grid>
    </Grid>
);

const ValuesSection = ({ content }: { content: AboutPageContent }) => (
    <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 8, md: 12 }, 
        py: { xs: 4, md: 6 }, 
        bgcolor: 'primary.main', 
        borderRadius: 4, 
        boxShadow: 3,
        px: { xs: 2, md: 6 },
    }}>
        <MainHeadingUserContent
            title={content.valuesTitle}
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
        />
        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'white', mb: 6 }}>
            {content.valuesSubtitle}
        </Typography>
        <Grid container spacing={4}>
            {content.values.map((value, index) => (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {valueIcons[index % valueIcons.length]}
                        <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2, color: 'secondary.light' }}>
                            {value.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
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
        <MainHeadingUserContent
            title={content.teamTitle}
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}
        />
        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 6 }}>
            {content.teamSubtitle}
        </Typography>
        <Grid container spacing={4}>
            {content.teamMembers.map((member, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
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
    <Paper
        elevation={10}
        sx={{
            p: { xs: 4, md: 6 }, textAlign: 'center', bgcolor: 'secondary.dark', color: 'white',
            borderRadius: 3, border: '2px solid', borderColor: 'primary.light',
            transform: 'translateY(10px)',
            '&:hover': { transform: 'translateY(0px) scale(1.01)', transition: '0.3s', bgcolor: 'secondary.main' }
        }}
    >
        <MainHeadingUserContent
            title={content.ctaTitle}
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, color: 'white' }}
        />
        <Button
            component={Link}
            href={ctaLink}
            variant="contained"
            size="large"
            color="primary"
            sx={{
                fontWeight: 700, py: 1.5, px: 4, borderRadius: 3,
                '&:hover': { transform: 'scale(1.05)', transition: '0.2s' }
            }}
        >
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
