// src/components/footers/DefaultFooter.tsx (or just Footer.tsx if it's your main one)
'use client';

import React from 'react';
import { Grid, Typography, Box, Container, IconButton, Stack } from '@mui/material';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AnimatedLink from './AnimatedLink'; // Assuming AnimatedLink is in the same directory or adjust path
import { siteConfig } from '@/config/client-data';

// --- Icon Imports ---
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { WebsiteLanguage } from '@/config/types';
import TiktokIcon from '@/components/icons/TiktokIcon';

// --- Dynamic Imports ---
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '100%', background: '#e0e0e0' }} />
  }
);

// --- Sub-components for Organization ---

const BrandInfo = ({ t, aboutSummary }: { t: any, aboutSummary: string }) => (
  <Grid  size={{xs: 12, sm: 6, md: 4}}> {/* Corrected Grid size prop to 'item' */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Image 
            src={siteConfig.logo}
            alt={`${siteConfig.siteName} Logo`}
            width={40} 
            height={40} 
            style={{ marginRight: '10px' }}
        />
        <Typography variant="h6" component="p" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {siteConfig.siteName}
        </Typography>
    </Box>
    {siteConfig.slogan && (
        <Typography variant="subtitle2" sx={{ color: 'footer.text', mb: 2 }}>
            {siteConfig.slogan}
        </Typography>
    )}
    {/* Conditional display for aboutUsContent */}
    {aboutSummary && (
      <Typography variant="body2">
        {aboutSummary.length > 150 ? `${aboutSummary.substring(0, 150)}...` : aboutSummary}
      </Typography>
    )}
    {!siteConfig.aboutUsContent.title && ( // Fallback if no specific content is provided
      <Typography variant="body2">
          {t('defaultAboutText')}
      </Typography>
    )}
  </Grid>
);

const FooterLinks = ({ t }: { t: any }) => {
  // Check if any link will be rendered (excluding "About" and "Contact" which are always present,
  // and now Privacy Policy and Terms of Use)
  const hasConditionalLinks = 
    siteConfig.hasReviewsSystem || 
    siteConfig.hasBlogSystem || 
    siteConfig.hasExperiencesSection || 
    siteConfig.hasFaqSection;

  // Only render this Grid column if there's at least one link to show
  // We now always show the "About", "Contact", "Privacy Policy", and "Terms of Use" links,
  // so this section will almost always be shown.
  if (!hasConditionalLinks && !siteConfig.contact.email) { // Adjusted condition to check for minimal content
     // If no optional feature links and no contact email, maybe this section is truly empty.
     // However, "About" and "Contact" links are always present, so this condition needs re-evaluation
     // or simply assume this section always renders now.
  }

  return (
    <Grid  size={{xs: 12, sm: 6, md: 4}}> {/* Corrected Grid size prop to 'item' */}
      <Typography variant="h6" component="p" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
          {t('linksTitle')}
      </Typography>
      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {siteConfig.hasReviewsSystem && <AnimatedLink href="/reviews">{t('reviewsLink')}</AnimatedLink>}
          {siteConfig.hasBlogSystem && <AnimatedLink href="/blog">{t('blogLink')}</AnimatedLink>}
          {siteConfig.hasExperiencesSection && <AnimatedLink href="/experiences">{t('experiencesLink')}</AnimatedLink>}
          {siteConfig.hasFaqSection && <AnimatedLink href="/faq">{t('faqLink')}</AnimatedLink>}
          <AnimatedLink href="/about">{t('aboutLink')}</AnimatedLink>
          <AnimatedLink href="/contact">{t('contactLink')}</AnimatedLink>
          {/* RECTIFICATION: Added Privacy Policy and Terms of Use links */}
          <AnimatedLink href="/privacy-policy">{t('privacyPolicyLink')}</AnimatedLink>
          <AnimatedLink href="/terms-of-use">{t('termsOfUseLink')}</AnimatedLink>
      </Box>
    </Grid>
  );
};

const ContactDetails = ({ t }: { t: any }) => {
  const hasContactInfo = 
    siteConfig.contact.address ||
    siteConfig.contact.phone ||
    siteConfig.contact.whatsappNumber ||
    siteConfig.contact.email ||
    siteConfig.social.facebook ||
    siteConfig.social.instagram ||
    siteConfig.social.twitter ||
    siteConfig.social.tiktok
    ;

  if (!hasContactInfo) {
    return null;
  }

  return (
    <Grid   size={{xs: 12, sm: 6, md: 4}}> {/* Corrected Grid size prop to 'item' */}
      <Typography variant="h6" component="p" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
          {t('contactTitle')}
      </Typography>
      <Stack spacing={1}>
          {siteConfig.contact.address && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mt: '2px', color: 'footer.text' }} />
                  <Typography variant="body2" sx={{ color: 'footer.text' }}>{siteConfig.contact.address}</Typography>
              </Box>
          )}
          {siteConfig.contact.phone && (
              <AnimatedLink href={`tel:${siteConfig.contact.phone}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ color: 'footer.text' }} />
                      <Typography variant="body2" sx={{ color: 'footer.text' }}>{siteConfig.contact.phone}</Typography>
                  </Box>
              </AnimatedLink>
          )}
          {siteConfig.contact.whatsappNumber && (
              <Box
                  component="a"
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WhatsAppIcon fontSize="small" sx={{ color: 'footer.text' }} />
                      <Typography variant="body2" sx={{ color: 'footer.text' }}>{siteConfig.contact.whatsappNumber}</Typography>
                  </Box>
              </Box>
          )}
          {siteConfig.contact.email && (
              <AnimatedLink href={`mailto:${siteConfig.contact.email}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'footer.text' }} />
                      <Typography variant="body2" sx={{ color: 'footer.text' }}>{siteConfig.contact.email}</Typography>
                  </Box>
              </AnimatedLink>
          )}
      </Stack>
      <Box sx={{ mt: 2 }}>
          {siteConfig.social.facebook && (
              <IconButton aria-label="Facebook" color="inherit" href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /></IconButton>
          )}
          {siteConfig.social.instagram && (
              <IconButton aria-label="Instagram" color="inherit" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /></IconButton>
          )}
          {siteConfig.social.twitter && (
              <IconButton aria-label="Twitter" color="inherit" href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer"><TwitterIcon /></IconButton>
          )}
          {siteConfig.social.tiktok && (
              <IconButton aria-label="Twitter" color="inherit" href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer"><TwitterIcon /></IconButton>
          )}
           {siteConfig.social.tiktok && (
              <IconButton aria-label="Twitter" color="inherit" href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer"> <TiktokIcon sx={{ transform: 'scale(1.5)' }}/></IconButton>
          )}
      </Box>
    </Grid>
  );
};

const CopyrightBar = ({ t }: { t: any }) => {
    const agencyUrl = "https://www.upmerce.com";
    return (
        <Box sx={{ pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
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
                    color: 'footer.text', 
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
                />
                <Typography variant="caption" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {t('agencyName')}
                </Typography>
            </Box>
        </Box>
    );
};


// --- Main Footer Component ---

export default function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();
  const locale = useLocale() as WebsiteLanguage;

  const showMap = 
    pathname !== '/contact' && 
    siteConfig.contact.latitude !== undefined && 
    siteConfig.contact.latitude !== null &&
    siteConfig.contact.longitude !== undefined &&
    siteConfig.contact.longitude !== null &&
    (siteConfig.contact.latitude !== 0 || siteConfig.contact.longitude !== 0);
    
    const aboutSummary = siteConfig.textContent?.[locale]?.aboutPage?.summary || siteConfig.textContent?.en?.aboutPage?.summary || '';

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'footer.background', 
        color: 'footer.text',
        py: { xs: 6, md: 8 },
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        {/* --- Top Row: Information Columns --- */}
        <Grid container spacing={5} sx={{ mb: 6 }}>
          <BrandInfo t={t} aboutSummary= {aboutSummary}/>
          {/* Only render FooterLinks if it has content (now handled internally by FooterLinks component) */}
          <FooterLinks t={t} />
          <ContactDetails t={t} />
        </Grid>

        {/* --- Map Section --- */}
        {showMap && siteConfig.contact.latitude !== undefined && siteConfig.contact.longitude !== undefined && (
          <Box sx={{ height: 250, borderRadius: 2, overflow: 'hidden', mb: 6 }}>
            <InteractiveMap latitude={siteConfig.contact.latitude} longitude={siteConfig.contact.longitude} />
          </Box>
        )}

        {/* --- Bottom Bar: Copyright & Credits --- */}
        <CopyrightBar t={t} />
      </Container>
    </Box>
  );
}