// src/components/footers/HighTrustFooter.tsx
'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Button, 
  InputBase, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  useMediaQuery, 
  useTheme,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Facebook, Instagram, Twitter, WhatsApp } from '@mui/icons-material';
import TiktokIcon from '@/components/icons/TiktokIcon'; // Keeping your custom icon
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { siteConfig } from '@/config/client-data';

// --- VISUAL CONSTANTS ---
const COLORS = {
  bg: '#1A1A1A', // Deep Charcoal
  text: '#E5E5E5',
  textDim: '#A3A3A3',
  primary: '#C86B52', // Terracotta
  border: 'rgba(255,255,255,0.1)'
};

// --- HELPER COMPONENT: Responsive Column (Accordion on Mobile / List on Desktop) ---
const FooterColumn = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Accordion 
        defaultExpanded={defaultOpen} 
        disableGutters 
        elevation={0} 
        sx={{ 
          bgcolor: 'transparent', 
          '&:before': { display: 'none' },
          color: COLORS.text 
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: COLORS.primary }} />}>
          <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
        {title}
      </Typography>
      <Box mt={2} display="flex" flexDirection="column" gap={1.5}>
        {children}
      </Box>
    </Box>
  );
};

// --- HELPER COMPONENT: Footer Link ---
const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <Typography 
      variant="body2" 
      sx={{ 
        color: COLORS.textDim, 
        transition: 'color 0.2s', 
        '&:hover': { color: COLORS.primary } 
      }}
    >
      {children}
    </Typography>
  </Link>
);

export default function HighTrustFooter() {
  //const t = useTranslations('Footer'); // You may need to add new keys to your en.json/fr.json
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: COLORS.bg, color: COLORS.text }}>
      
      {/* 1. PRE-FOOTER (The Hook) */}
      <Box sx={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <Container maxWidth="lg">
          <Box py={6} display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" gap={4}>
            <Box maxWidth={500}>
              <Typography variant="h5" fontFamily='"Playfair Display", serif' gutterBottom>
                Get the Agadir Insider's Guide.
              </Typography>
              <Typography variant="body2" color={COLORS.textDim}>
                Join 15,000+ travelers getting weekly surf reports, hidden gem alerts, and exclusive Souss-Massa itineraries.
              </Typography>
            </Box>
            
            <Paper 
              component="form" 
              sx={{ 
                p: '4px', display: 'flex', alignItems: 'center', width: { xs: '100%', md: 400 }, 
                bgcolor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}`, borderRadius: 1 
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1, color: 'white' }}
                placeholder="Email address"
                inputProps={{ 'aria-label': 'join newsletter' }}
              />
              <Button sx={{ bgcolor: COLORS.primary, color: 'white', px: 3, '&:hover': { bgcolor: '#b0553e' } }}>
                Join
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* 2. MAIN LINKS (The SEO Grid) */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={{ xs: 2, md: 8 }}>
          
          {/* COL 1: BRAND IDENTITY (Always visible) */}
          <Grid  size= {{xs: 12, md: 4}}>
            <Box mb={3} display="flex" alignItems="center" gap={1}>
              <Image src={siteConfig.logo} alt="MarraGo Logo" width={40} height={40} />
              <Typography variant="h6" fontWeight="bold">MarraGo.</Typography>
            </Box>
            <Typography variant="body2" color={COLORS.textDim} mb={3} lineHeight={1.6}>
              Crafting premium experiences in the Souss-Massa region since 2015. 
              {siteConfig.contact.address && <><br /><br />📍 {siteConfig.contact.address}</>}
            </Typography>
            <Stack direction="row" spacing={1}>
              {siteConfig.social.instagram && <IconButton size="small" sx={{ color: 'white' }} href={siteConfig.social.instagram}><Instagram /></IconButton>}
              {siteConfig.social.facebook && <IconButton size="small" sx={{ color: 'white' }} href={siteConfig.social.facebook}><Facebook /></IconButton>}
              {siteConfig.social.twitter && <IconButton size="small" sx={{ color: 'white' }} href={siteConfig.social.twitter}><Twitter /></IconButton>}
              {siteConfig.social.tiktok && <IconButton size="small" sx={{ color: 'white' }} href={siteConfig.social.tiktok}><TiktokIcon /></IconButton>}
            </Stack>
          </Grid>

          {/* COL 2: DESTINATIONS (SEO Goldmine) */}
          <Grid  size= {{xs: 12, md: 2}}>
            <FooterColumn title="Explore Agadir">
              <FooterLink href="/destinations/agadir">Agadir City Center</FooterLink>
              <FooterLink href="/destinations/taghazout">Taghazout Bay</FooterLink>
              <FooterLink href="/destinations/tamraght">Tamraght Village</FooterLink>
              <FooterLink href="/destinations/paradise-valley">Paradise Valley</FooterLink>
              <FooterLink href="/destinations/imsouane">Imsouane</FooterLink>
            </FooterColumn>
          </Grid>

          {/* COL 3: INTERESTS (Activity Based) */}
          <Grid  size= {{xs: 12, md: 3}}>
            <FooterColumn title="Experiences">
              <FooterLink href="/experiences/surf">Surf Coaching & Camps</FooterLink>
              <FooterLink href="/experiences/desert">Desert & 4x4 Tours</FooterLink>
              <FooterLink href="/experiences/culture">Souk & City Tours</FooterLink>
              <FooterLink href="/experiences/wellness">Hammam & Spa</FooterLink>
              <FooterLink href="/blog">Travel Journal</FooterLink>
            </FooterColumn>
          </Grid>

          {/* COL 4: SUPPORT (Trust & Conversion) */}
          <Grid  size= {{xs: 12, md: 3}}>
            <FooterColumn title="Help & Contact" defaultOpen={true}>
              <Button 
                startIcon={<WhatsApp />} 
                variant="outlined" 
                href={`https://wa.me/${siteConfig.contact.whatsappNumber?.replace(/\D/g, '')}`}
                sx={{ 
                  color: '#25D366', 
                  borderColor: '#25D366', 
                  justifyContent: 'flex-start',
                  mb: 2,
                  '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)', borderColor: '#25D366' } 
                }}
              >
                Chat on WhatsApp
              </Button>
              <FooterLink href="/contact">Help Center</FooterLink>
              <FooterLink href="/contact">Partner with us</FooterLink>
              <FooterLink href="/contact">Cancellation Policy</FooterLink>
            </FooterColumn>
          </Grid>

        </Grid>
      </Container>

      {/* 3. TRUST BAR (The Footer Bottom) */}
      <Box sx={{ borderTop: `1px solid ${COLORS.border}`, bgcolor: '#111' }}>
        <Container maxWidth="lg">
          <Box py={3} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
            
            {/* Copyright & License */}
            <Box textAlign={{ xs: 'center', md: 'left' }}>
               <Typography variant="caption" display="block" color={COLORS.textDim}>
                 © {currentYear} {siteConfig.brandName} SARL. All rights reserved.
               </Typography>
               <Typography variant="caption" color={COLORS.textDim} sx={{ opacity: 0.6 }}>
                 Official Tourism License N°: 12345/AT
               </Typography>
            </Box>

            {/* Payment Badges (Visual Trust) */}
            <Stack direction="row" spacing={2} sx={{ opacity: 0.7 }}>
              {/* Replace these with actual SVGs or Images in production */}
              <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>VISA</Typography>
              <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>Mastercard</Typography>
              <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>PayPal</Typography>
            </Stack>

            {/* Legal Links */}
            <Stack direction="row" spacing={3}>
              <Link href="/terms-of-use" style={{ textDecoration: 'none' }}>
                <Typography variant="caption" color={COLORS.textDim}>Terms</Typography>
              </Link>
              <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                <Typography variant="caption" color={COLORS.textDim}>Privacy</Typography>
              </Link>
              <Link href="/sitemap" style={{ textDecoration: 'none' }}>
                <Typography variant="caption" color={COLORS.textDim}>Sitemap</Typography>
              </Link>
            </Stack>

          </Box>
        </Container>
      </Box>
    </Box>
  );
}