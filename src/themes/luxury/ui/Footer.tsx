// /src/themes/luxury/ui/Footer.tsx
'use client';

import React from 'react';
import { Typography, Box, Container, IconButton, Grid, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import social media icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

// Dynamically import the map to avoid SSR issues, just like in the default theme
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: 'action.hover' }} />
  }
);

// A reusable component for the footer link columns
const FooterLinkColumn = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => (
  <Grid  size={{ xs: 12, sm: 4, md: 2.5 }}>
    <Typography 
      variant="overline" 
      sx={{ 
        fontWeight: 'bold', 
        color: 'text.primary',
        letterSpacing: '0.08em',
        mb: 2,
        display: 'block'
      }}
    >
      {title}
    </Typography>
    <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {links.map((link) => (
        <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
          <Typography sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
            {link.label}
          </Typography>
        </Link>
      ))}
    </Box>
  </Grid>
);


export default function Footer() {
  const t = useTranslations('Footer');
  const t_nav = useTranslations('Header');
  const pathname = usePathname();
  const showMap = pathname !== '/contact'; // Hide map on the contact page

  const companyLinks = [
    { href: '/about', label: t_nav('about') },
    { href: '/blog', label: t_nav('blogLink') },
    { href: '/contact', label: t_nav('contact') },
  ];

  const exploreLinks = [
    { href: '/experiences', label: t_nav('experiences') },
    { href: '/experiences?style=cultural', label: 'Cultural Tours' },
    { href: '/experiences?style=adventure', label: 'Adventure Treks' },
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.secondary',
        // Increased padding to give the map and content more breathing room
        py: { xs: 8, md: 12 },
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        {/* --- Top Row: Information Columns --- */}
        <Grid container spacing={5} justifyContent="space-between" sx={{ mb: 8 }}>
          {/* Brand & Social Column */}
          <Grid  size={{xs: 12, md: 4}}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', marginBottom: '16px' }}>
                <Image src="/favicon.ico" alt="logo" width={40} height={40} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 2, color: 'text.primary' }}>{siteConfig.siteName}</Typography>
            </Link>
            <Typography variant="body2" sx={{ maxWidth: '300px', mb: 2 }}>
              {t('aboutText')}
            </Typography>
            <Box>
              <IconButton aria-label="Facebook" color="inherit" href="#"><FacebookIcon /></IconButton>
              <IconButton aria-label="Instagram" color="inherit" href="#"><InstagramIcon /></IconButton>
              <IconButton aria-label="Twitter" color="inherit" href="#"><TwitterIcon /></IconButton>
            </Box>
          </Grid>

          {/* Link Columns */}
          <FooterLinkColumn title={t('companyTitle')} links={companyLinks} />
          <FooterLinkColumn title={t('exploreTitle')} links={exploreLinks} />
          
        </Grid>

        {/* --- THIS IS THE NEW SECTION --- */}
        {/* Map Section */}
        {showMap && (
          <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mb: 8 }}>
              <InteractiveMap latitude={30.4278} longitude={-9.5981} />
          </Box>
        )}

        {/* Bottom Bar: Copyright & Legal Links */}
        <Divider sx={{ mb: 3 }}/>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2">
            {t('copyright', { year: new Date().getFullYear() })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
             <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{t('privacyPolicy')}</Typography>
            </Link>
             <Link href="/terms-of-service" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{t('termsOfService')}</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}