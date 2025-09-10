// /src/themes/adventure/ui/Footer.tsx
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, IconButton, Divider } from '@mui/material';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';

// Import social media icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: 'action.hover' }} />
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
        // --- ADVENTURE THEME STYLING ---
        bgcolor: 'grey.900', 
        color: 'grey.400',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* --- TOP ROW: Information Columns --- */}
        <Grid container spacing={5} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" component="p" sx={{ color: 'common.white', fontWeight: 'bold', mb: 2 }}>
              {siteConfig.siteName}
            </Typography>
            <Typography variant="body2">
              {t('aboutText')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" component="p" sx={{ color: 'common.white', fontWeight: 'bold', mb: 2 }}>
              {t('linksTitle')}
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }}>{t('aboutLink')}</Typography>
              </Link>
              <Link href="/experiences" style={{ textDecoration: 'none' }}>
                 <Typography sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }}>{t('experiencesLink')}</Typography>
              </Link>
              <Link href="/blog" style={{ textDecoration: 'none' }}>
                 <Typography sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }}>{t('blogLink')}</Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                 <Typography sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }}>{t('contactLink')}</Typography>
              </Link>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" component="p" sx={{ color: 'common.white', fontWeight: 'bold', mb: 2 }}>
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

        {/* --- MAP SECTION RE-INTEGRATED --- */}
        {showMap && (
          <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mb: 6, border: '1px solid', borderColor: 'divider' }}>
              <InteractiveMap latitude={30.4278} longitude={-9.5981} />
          </Box>
        )}
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }}/>

        {/* --- BOTTOM ROW: Copyright --- */}
        <Box sx={{ pt: 4, textAlign: 'center' }}>
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
              color: 'grey.400',
              opacity: 0.7,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 1 }
            }}
          >
            <Typography variant="caption" sx={{ mr: 1 }}>{t('poweredBy')}</Typography>
            <Image 
              src="/upmerce.webp"
              alt="upmerce logo"
              loading='lazy'
              width={20}
              height={20}
              sizes="20px"
              style={{ filter: 'brightness(0) invert(1)' }} // Invert logo to white for dark background
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