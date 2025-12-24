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
  Stack,
  alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Facebook, Instagram, Twitter, WhatsApp } from '@mui/icons-material';
import TiktokIcon from '@/components/icons/TiktokIcon'; // Ensure this path is correct
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { siteConfig } from '@/config/client-data';

// --- VISUAL CONSTANTS (High Trust Dark Theme) ---
const COLORS = {
  bg: '#1A1A1A', // Deep Charcoal (Luxury Standard)
  text: '#E5E5E5',
  textDim: '#A3A3A3',
  primary: siteConfig.colors.primaryColor || '#C86B52', // Dynamic Brand Color
  border: 'rgba(255,255,255,0.1)'
};

// --- HELPER: Responsive Column ---
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
        <AccordionDetails sx={{ pt: 0, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white', mb: 2 }}>
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        {children}
      </Box>
    </Box>
  );
};

// --- HELPER: Footer Link ---
const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <Typography 
      variant="body2" 
      sx={{ 
        color: COLORS.textDim, 
        transition: 'color 0.2s', 
        '&:hover': { color: COLORS.primary, transform: 'translateX(2px)' },
        display: 'inline-block'
      }}
    >
      {children}
    </Typography>
  </Link>
);

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  
  // DYNAMIC DATA: Get cities from siteConfig
  // We slice the top 6 to avoid cluttering the footer
  const popularLocations = siteConfig.tourLocationsServed.slice(0, 6);

  return (
    <Box component="footer" sx={{ bgcolor: COLORS.bg, color: COLORS.text, borderTop: `1px solid ${COLORS.primary}` }}>
      
      {/* 1. PRE-FOOTER (Newsletter Lite) */}
      <Box sx={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <Container maxWidth="lg">
          <Box py={6} display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" gap={4}>
            <Box maxWidth={500}>
              <Typography variant="h5" fontFamily='"Playfair Display", serif' gutterBottom sx={{ fontWeight: 700 }}>
                {t('newsletterTitle')}
              </Typography>
              <Typography variant="body2" color={COLORS.textDim}>
                {t('newsletterSubtitle')}
              </Typography>
            </Box>
            
            <Paper 
              component="form" 
              sx={{ 
                p: '4px', display: 'flex', alignItems: 'center', width: { xs: '100%', md: 400 }, 
                bgcolor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}`, borderRadius: 50 
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1, color: 'white', fontSize: '0.9rem' }}
                placeholder={t('emailPlaceholder')}
                inputProps={{ 'aria-label': 'join newsletter' }}
              />
              <Button 
                sx={{ 
                    bgcolor: COLORS.primary, 
                    color: 'white', 
                    px: 3, 
                    borderRadius: 50,
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: alpha(COLORS.primary, 0.8) } 
                }}
              >
                {t('joinButton')}
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* 2. MAIN LINKS (The SEO Grid) */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={{ xs: 2, md: 8 }}>
          
          {/* COL 1: BRAND IDENTITY (Always visible) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box mb={3} display="flex" alignItems="center" gap={1}>
                {/* Fallback to text if logo fails, but assume logo exists */}
               {siteConfig.logo ? (
                   <Box sx={{ position: 'relative', width: 140, height: 50 }}>
                        <Image 
                            src={siteConfig.logo} 
                            alt={`${siteConfig.brandName} Logo`} 
                            fill 
                            style={{ objectFit: 'contain', objectPosition: 'left' }} 
                        />
                   </Box>
               ) : (
                   <Typography variant="h5" fontWeight="bold" fontFamily='"Playfair Display", serif'>{siteConfig.brandName}</Typography>
               )}
            </Box>
            <Typography variant="body2" color={COLORS.textDim} mb={3} lineHeight={1.6}>
              {t('brandTagline')}
              <br /><br />
              {siteConfig.contact.address && `📍 ${siteConfig.contact.address}`}
            </Typography>
            <Stack direction="row" spacing={1}>
              {siteConfig.social.instagram && <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#E1306C' } }} href={siteConfig.social.instagram}><Instagram /></IconButton>}
              {siteConfig.social.facebook && <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#1877F2' } }} href={siteConfig.social.facebook}><Facebook /></IconButton>}
              {siteConfig.social.twitter && <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }} href={siteConfig.social.twitter}><Twitter /></IconButton>}
              {siteConfig.social.tiktok && <IconButton size="small" sx={{ color: 'white', '&:hover': { color: '#000000', bgcolor: 'white' } }} href={siteConfig.social.tiktok}><TiktokIcon /></IconButton>}
            </Stack>
          </Grid>

          {/* COL 2: DESTINATIONS (Dynamic National Scope) */}
          <Grid size={{ xs: 12, md: 2 }}>
            <FooterColumn title={t('colDestinations')}>
              {/* Dynamically Map Top 6 Cities from Config */}
              {popularLocations.map((city) => (
                  <FooterLink key={city} href={`/experiences?q=${city}`}>
                      {city}
                  </FooterLink>
              ))}
              <FooterLink href="/experiences">View All Locations</FooterLink>
            </FooterColumn>
          </Grid>

          {/* COL 3: INTERESTS (Static Categories) */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FooterColumn title={t('colExperiences')}>
              <FooterLink href="/experiences?category=surf">Surf Coaching & Camps</FooterLink>
              <FooterLink href="/experiences?category=desert">Desert & 4x4 Tours</FooterLink>
              <FooterLink href="/experiences?category=culture">Souk & City Tours</FooterLink>
              <FooterLink href="/experiences?category=wellness">Hammam & Spa</FooterLink>
              <FooterLink href="/blog">Travel Journal</FooterLink>
            </FooterColumn>
          </Grid>

          {/* COL 4: SUPPORT (Trust & Conversion) */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FooterColumn title={t('colHelp')} defaultOpen={true}>
              <Button 
                startIcon={<WhatsApp />} 
                variant="outlined" 
                href={`https://wa.me/${siteConfig.contact.whatsappNumber?.replace(/\D/g, '')}`}
                sx={{ 
                  color: '#25D366', 
                  borderColor: '#25D366', 
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  mb: 2,
                  '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)', borderColor: '#25D366' } 
                }}
              >
                {t('chatWhatsapp')}
              </Button>
              <FooterLink href="/contact">{t('helpCenter')}</FooterLink>
              <FooterLink href="/contact">{t('partnerWithUs')}</FooterLink>
              <FooterLink href="/terms">{t('cancellationPolicy')}</FooterLink>
            </FooterColumn>
          </Grid>

        </Grid>
      </Container>

      {/* 3. TRUST BAR (The Footer Bottom) */}
      <Box sx={{ borderTop: `1px solid ${COLORS.border}`, bgcolor: '#111' }}>
        <Container maxWidth="lg">
          <Box py={3} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" gap={3}>
            
            {/* A. LEFT: Copyright & License */}
            <Box textAlign={{ xs: 'center', md: 'left' }}>
               <Typography variant="caption" display="block" color={COLORS.textDim}>
                 © {currentYear} {siteConfig.brandName}. {t('rightsReserved')}
               </Typography>
               <Typography variant="caption" color={COLORS.textDim} sx={{ opacity: 0.6 }}>
                 {t('officialLicense')}
               </Typography>
            </Box>

            {/* B. CENTER: Payment Badges */}
            <Stack direction="row" spacing={2} sx={{ opacity: 0.8, alignItems: 'center' }}>
                <Box sx={{ width: 40, height: 25, position: 'relative', bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Image src="/images/payment/visa.webp" alt="Visa" fill style={{ objectFit: 'contain', padding: '2px' }} />
                </Box>
                <Box sx={{ width: 40, height: 25, position: 'relative', bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Image src="/images/payment/mastercard.webp" alt="Mastercard" fill style={{ objectFit: 'contain', padding: '2px' }} />
                </Box>
                <Box sx={{ width: 40, height: 25, position: 'relative', bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Image src="/images/payment/paypal.webp" alt="PayPal" fill style={{ objectFit: 'contain', padding: '2px' }} />
                </Box>
            </Stack>

            {/* C. RIGHT: Legal Links & Upmerce Credit (Consolidated) */}
            <Stack alignItems={{ xs: 'center', md: 'flex-end' }} spacing={1} sx={{ pr: { xs: 0, md: 10 } }}>
                
                {/* 1. Legal Links Row (Terms, Privacy, Sitemap) */}
                <Stack direction="row" spacing={3}>
                    <Link href="/terms-of-use" style={{ textDecoration: 'none' }}>
                        <Typography variant="caption" color={COLORS.textDim} sx={{'&:hover':{color:COLORS.primary}}}>
                            {t('terms')}
                        </Typography>
                    </Link>
                    <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                        <Typography variant="caption" color={COLORS.textDim} sx={{'&:hover':{color:COLORS.primary}}}>
                            {t('privacy')}
                        </Typography>
                    </Link>
                    <Link href="/sitemap" style={{ textDecoration: 'none' }}>
                        <Typography variant="caption" color={COLORS.textDim} sx={{'&:hover':{color:COLORS.primary}}}>
                            {t('sitemap')}
                        </Typography>
                    </Link>
                </Stack>

                {/* 2. Upmerce Credit (Localized) */}
                <Box 
                    component="a" 
                    href="https://upmerce.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.8, 
                        opacity: 0.4, 
                        transition: 'all 0.2s', 
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': { opacity: 1, transform: 'translateY(-1px)' } 
                    }}
                >
                    <Typography 
                        variant="caption" 
                        color={COLORS.textDim} 
                        sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}
                    >
                        {t('poweredBy')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 0.5, borderLeft: `1px solid ${COLORS.textDim}` }}>
                        <Box sx={{ width: 14, height: 14, position: 'relative' }}>
                             <Image src="/upmerce.webp" alt="Upmerce" fill style={{ objectFit: 'contain' }} />
                        </Box>
                        <Typography variant="caption" fontWeight="800" color="white" sx={{ fontSize: '0.7rem', letterSpacing: 0.5 }}>
                            UPMERCE
                        </Typography>
                    </Box>
                </Box>
            </Stack>

          </Box>
        </Container>
      </Box>
    </Box>
  );
}