'use client';

import React from 'react';
import { Grid, Typography, Box, Container, Button } from '@mui/material';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// --- Data Imports ---
import { siteConfig } from '@/config/client-data';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';

// --- Icon Imports ---
import PublicIcon from '@mui/icons-material/Public';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SpaIcon from '@mui/icons-material/Spa';

// --- Dynamic Component Imports ---
import { TeamMemberCardProps } from '../ui/TeamMemberCard';
import { AboutPageContent } from '@/config/types';
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const TeamMemberCard = dynamic<TeamMemberCardProps>(() => import(`@/themes/${theme}/ui/TeamMemberCard`));

// --- Static Data ---
// const aboutImageUrl = siteConfig.aboutUsContent.imageUrl;
const ctaLink = '/contact';
const valueIcons = [
    <PublicIcon key="public" fontSize="large" color="primary" />,
    <HandshakeIcon key="handshake" fontSize="large" color="primary" />,
    <SpaIcon key="spa" fontSize="large" color="primary" />,
];

// --- Sub-components for Organization ---

const StorySection = ({ content }: { content: AboutPageContent }) => (
    <Grid container spacing={8} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ pr: { md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
                <MainHeadingUserContent
                    title={content.title}
                    sx={{
                        fontWeight: 400,
                        mb: 2, // Adjusted margin
                        color: 'text.primary',
                    }}
                />
                {/* INTEGRATED: Slogan from siteConfig */}
                {siteConfig.slogan && (
                    <Typography variant="h5" component="p" color="primary" sx={{ mb: 4, fontWeight: 500 }}>
                        {siteConfig.slogan}
                    </Typography>
                )}
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.8 }}>
                    {content.paragraph1}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {content.paragraph2}
                </Typography>
            </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                maxWidth: 500,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                mx: 'auto',
            }}>
                <Image
                    src={content.imageUrl}
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
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <MainHeadingUserContent
                title={content.valuesTitle}
                sx={{ fontWeight: 400, color: 'text.primary', mb: 3 }}
            />
            <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 8 }}>
                {content.valuesSubtitle}
            </Typography>
            <Grid container spacing={5}>
                {content.values.map((value, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index}>
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
        </Container>
    </Box>
);

const TeamSection = ({ content }: { content: AboutPageContent }) => (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <MainHeadingUserContent
            title={content.teamTitle}
            sx={{ fontWeight: 400, color: 'text.primary', mb: 3 }}
        />
        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', mb: 8 }}>
            {content.teamSubtitle}
        </Typography>
        <Grid container spacing={4}>
            {content.teamMembers.map((member, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <TeamMemberCard
                        image={member.image}
                        name={member.name}
                        title={member.title}
                        bio={member.bio}
                    />
                </Grid>
            ))}
        </Grid>
    </Container>
);

const CtaSection = ({ content }: { content: AboutPageContent }) => (
    <Box sx={{ py: { xs: 8, md: 10 }, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <MainHeadingUserContent
            title={content.ctaTitle}
            variant="h3"
            sx={{ fontWeight: 400, mb: 4 }}
        />
        <Button
            component={Link}
            href={ctaLink}
            variant="outlined"
            size="large"
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
        >
            {content.ctaButtonText}
        </Button>
    </Box>
);

// --- Main AboutSection Component ---

export default function AboutSection() {
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const content: AboutPageContent = siteConfig.textContent[locale]?.aboutPage || siteConfig.textContent.en.aboutPage;

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 } }}>
        <StorySection content={content} />
      </Container>
      <ValuesSection content={content} />
      <TeamSection content={content} />
      <CtaSection content={content} />
    </Box>
  );
}

