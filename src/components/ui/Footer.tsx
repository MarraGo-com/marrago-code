// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/components/ui/Footer.tsx
// This component now uses the new AnimatedLink for a more professional feel.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, IconButton } from '@mui/material';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AnimatedLink from './AnimatedLink'; // <-- 1. Import the new component

// Import social media icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { siteConfig } from '@/config/site';

const InteractiveMap = dynamic(
  () => import('./InteractiveMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '100%', background: '#e0e0e0' }} />
  }
);

export default function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();
  const showMap = pathname !== '/contact';
  const agencyUrl = "https://www.upmerce.com";

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.secondary',
        py: { xs: 6, md: 8 },
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        {/* --- TOP ROW: Information Columns --- */}
        <Grid container spacing={5} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
              {siteConfig.siteName}
            </Typography>
            <Typography variant="body2">
              {t('aboutText')}
            </Typography>
          </Grid>
          <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
             <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
              {t('linksTitle')}
            </Typography>
            {/* --- 2. Use the new AnimatedLink component --- */}
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AnimatedLink href="/about">{t('aboutLink')}</AnimatedLink>
              <AnimatedLink href="/experiences">{t('experiencesLink')}</AnimatedLink>
              <AnimatedLink href="/blog">{t('blogLink')}</AnimatedLink>
              <AnimatedLink href="/contact">{t('contactLink')}</AnimatedLink>
            </Box>
          </Grid>
          <Grid  size={{ xs: 12, sm: 6, md: 4 }}>
             <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
              {t('contactTitle')}
            </Typography>
            <Typography variant="body2">{t('address')}</Typography>
            <Typography variant="body2">{t('phone')}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{t('email')}</Typography>
            <Box>
              <IconButton aria-label="Facebook" color="inherit" href="#"><FacebookIcon /></IconButton>
              <IconButton aria-label="Instagram" color="inherit" href="#"><InstagramIcon /></IconButton>
              <IconButton aria-label="Twitter" color="inherit" href="#"><TwitterIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>

        {showMap && (
          <Box sx={{ height: 250, borderRadius: 2, overflow: 'hidden', mb: 6 }}>
              <InteractiveMap latitude={30.2167} longitude={-9.3667} />
          </Box>
        )}

        <Box sx={{ pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('copyright', { year: new Date().getFullYear() })}
          </Typography>
          <Box
            component="a"
            href={agencyUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.secondary',
              opacity: 0.7,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 1 }
            }}
          >
            <Typography variant="caption" sx={{ mr: 1 }}>{t('poweredBy')}</Typography>
            <Image 
              src="/upmerce.webp"
              alt="upmerce logo"
              width={20}
              height={20}
            />
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 'bold' }}>
              {t('agencyName')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
