// src/components/footers/AdventureFooter.tsx (or your actual file path)
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, IconButton, Divider, Stack, SxProps, Theme } from '@mui/material';
import { usePathname, Link } from '@/i18n/navigation';
import {useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';


// --- Icon Imports ---
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { siteConfig } from '@/config/client-data';
import { WebsiteLanguage } from '@/config/types';
import TiktokIcon from '@/components/icons/TiktokIcon';

// --- Dynamic Imports ---
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: 'action.hover' }} />
  }
);

// --- Reusable Style for Animated Links ---
const animatedLinkSx: SxProps<Theme> = {
  display: 'inline-block',
  position: 'relative',
  color: 'grey.400',
  '&:hover': { color: 'common.white' },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '1px',
    bottom: '-2px',
    left: 0,
    backgroundColor: 'primary.main',
    transformOrigin: 'bottom left',
    transition: 'transform 0.25s ease-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom left',
  },
};


// --- Sub-components for Organization ---

const BrandInfo = ({ t, aboutSummary }: { t: any, aboutSummary: string }) => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Image 
                src={siteConfig.logo}
                alt={`${siteConfig.siteName} Logo`}
                width={60} 
                height={60} 
                style={{ marginRight: '10px' }}
            />
            <Typography variant="h6" component="p" sx={{ color: 'common.white', fontWeight: 'bold' }}>
                {siteConfig.siteName}
            </Typography>
        </Box>
        {siteConfig.slogan && (
            <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 2 }}>
                {siteConfig.slogan}
            </Typography>
        )}
        {/* RECTIFICATION: Conditional display for aboutUsContent with fallback */}
    {aboutSummary ? (
      <Typography variant="body2" sx={{ color: 'grey.400' }}> {/* Added color for consistency */}
        {aboutSummary.length > 150 ? `${aboutSummary.substring(0, 150)}...` : aboutSummary}
      </Typography>
    ) : (
      <Typography variant="body2" sx={{ color: 'grey.400' }}> {/* Added color for consistency */}
        {t('defaultAboutText')}
      </Typography>
    )}
    </Grid>
);

const FooterLinks = ({ t_nav }: { t_nav: any }) => {
  // RECTIFICATION: Determine if this Grid column should render at all
 /*  const hasConditionalLinks = 
    siteConfig.hasReviewsSystem ||
    siteConfig.hasBlogSystem ||
    siteConfig.hasExperiencesSection ||
    siteConfig.hasFaqSection; */

  // The 'About', 'Contact', 'Privacy Policy', and 'Terms of Use' links are always present,
  // so this section will always render. The conditional check for column rendering
  // should only happen if you intend to hide the *entire* links column if *only*
  // the mandatory links are present, which is typically not desired.

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="h6" component="p" sx={{ color: 'common.white', fontWeight: 'bold', mb: 2 }}>
            {t_nav('linksTitle')}
        </Typography>
        <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* RECTIFICATION: Conditional rendering using siteConfig.has... properties */}
            {siteConfig.hasReviewsSystem && <Link href="/reviews" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('reviewsLink')}</Typography></Link>}
            {siteConfig.hasBlogSystem && <Link href="/blog" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('blogLink')}</Typography></Link>}
            {siteConfig.hasExperiencesSection && <Link href="/experiences" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('experiencesLink')}</Typography></Link>}
            {siteConfig.hasFaqSection && <Link href="/faq" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('faqLink')}</Typography></Link>}
            <Link href="/about" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('about')}</Typography></Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('contact')}</Typography></Link>
            {/* RECTIFICATION: Added Privacy Policy and Terms of Use links, using animatedLinkSx */}
            <Link href="/privacy-policy" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('privacyPolicyLink')}</Typography></Link>
            <Link href="/terms-of-use" style={{ textDecoration: 'none' }}><Typography sx={animatedLinkSx}>{t_nav('termsOfUseLink')}</Typography></Link>
        </Box>
    </Grid>
  );
};

const ContactDetails = ({ t }: { t: any }) => {
  // RECTIFICATION: Only render this Grid column if there is ANY contact info
  const hasContactInfo = 
    siteConfig.contact.address ||
    siteConfig.contact.phone ||
    siteConfig.contact.whatsappNumber ||
    siteConfig.contact.email ||
    siteConfig.social.facebook ||
    siteConfig.social.instagram ||
    siteConfig.social.twitter ||
    siteConfig.social.tiktok;

  if (!hasContactInfo) {
    return null; // Don't render the entire column if no contact details are present
  }

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="h6" component="p" sx={{ color: 'common.white', fontWeight: 'bold', mb: 2 }}>
          {t('contactTitle')}
      </Typography>
      <Stack spacing={1}>
          {siteConfig.contact.address && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mt: '2px', color: 'grey.400' }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>{siteConfig.contact.address}</Typography>
              </Box>
          )}
          {siteConfig.contact.phone && (
              <Link href={`tel:${siteConfig.contact.phone}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ color: 'grey.400' }} />
                      <Typography variant="body2" sx={animatedLinkSx}>{siteConfig.contact.phone}</Typography>
                  </Box>
              </Link>
          )}
          {siteConfig.contact.whatsappNumber && (
              <Link href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WhatsAppIcon fontSize="small" sx={{ color: 'grey.400' }} />
                      <Typography variant="body2" sx={animatedLinkSx}>{siteConfig.contact.whatsappNumber}</Typography>
                  </Box>
              </Link>
          )}
          {siteConfig.contact.email && (
              <Link href={`mailto:${siteConfig.contact.email}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'grey.400' }} />
                      <Typography variant="body2" sx={animatedLinkSx}>{siteConfig.contact.email}</Typography>
                  </Box>
              </Link>
          )}
      </Stack>
      <Box sx={{ mt: 2 }}>
          {/* RECTIFICATION: Conditional rendering for social icons */}
          {siteConfig.social.facebook && (
              <IconButton aria-label="Facebook" sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }} href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /></IconButton>
          )}
          {siteConfig.social.instagram && (
              <IconButton aria-label="Instagram" sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }} href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /></IconButton>
          )}
          {siteConfig.social.twitter && (
              <IconButton aria-label="Twitter" sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }} href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer"><TwitterIcon /></IconButton>
          )}
          {siteConfig.social.tiktok && (
              <IconButton aria-label="Twitter" sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }} href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer">
                <TiktokIcon sx={{ transform: 'scale(1.5)' }}/>
              </IconButton>
          )}
      </Box>
    </Grid>
  );
};

const CopyrightBar = ({ t }: { t: any }) => {
    const agencyUrl = "https://www.upmerce.com";
    return (
        <Box sx={{ pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
                &copy; {new Date().getFullYear()} {siteConfig.brandName}. {t('allRightsReserved')}
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
                    // The 'style' prop with the filter has been removed based on your guidance.
                />
                <Typography variant="caption" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {t('agencyName')}
                </Typography>
            </Box>
        </Box>
    );
};


// --- Main Footer Component ---

export default function AdventureFooter() { // Renamed to AdventureFooter for clarity
  const t = useTranslations('Footer');
  const t_nav = useTranslations('Header'); // Uses 'Header' translations for navigation links
  const pathname = usePathname();
  const locale = useLocale() as WebsiteLanguage;
  // RECTIFICATION: Conditional map display logic
  const showMap = 
    pathname !== '/contact' && 
    siteConfig.contact.latitude !== undefined && 
    siteConfig.contact.latitude !== null &&
    siteConfig.contact.longitude !== undefined &&
    siteConfig.contact.longitude !== null &&
    (siteConfig.contact.latitude !== 0 || siteConfig.contact.longitude !== 0); // Only show if explicit non-zero coordinates exist
    const aboutSummary = siteConfig.textContent?.[locale]?.aboutPage?.summary || siteConfig.textContent?.en?.aboutPage?.summary || '';
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'grey.900', 
        color: 'grey.400',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* --- Top Row: Information Columns --- */}
        <Grid container spacing={5} sx={{ mb: 6 }}>
          <BrandInfo t={t} aboutSummary= {aboutSummary}/>
          <FooterLinks t_nav={t_nav} />
          <ContactDetails t={t} />
        </Grid>

        {/* --- Map Section --- */}
        {showMap && (
          <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mb: 6, border: '1px solid', borderColor: 'rgba(255,255,255,0.1)' }}>
              <InteractiveMap latitude={siteConfig.contact.latitude || 0} longitude={siteConfig.contact.longitude || 0} />
          </Box>
        )}
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }}/>

        {/* --- Bottom Row: Copyright --- */}
        <CopyrightBar t={t} />
      </Container>
    </Box>
  );
}