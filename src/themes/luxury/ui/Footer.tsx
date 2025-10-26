// src/components/footers/LuxuryFooter.tsx (or your actual file path)
'use client';

import React from 'react';
import { Typography, Box, Container, IconButton, Grid, Divider, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { siteConfig } from '@/config/client-data';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// --- Icon Imports ---
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// --- Dynamic Imports ---
const InteractiveMap = dynamic(
  () => import('@/components/ui/InteractiveMap'),
  {
    ssr: false,
    loading: () => <Box sx={{ height: '100%', bgcolor: 'action.hover' }} />
  }
);


// --- Sub-components for Organization ---

const BrandInfo = ({ t }: { t: any }) => { // Added 't' prop for defaultAboutText
  const hasSocials = siteConfig.social.facebook || siteConfig.social.instagram || siteConfig.social.twitter;

  return (
    <Grid size={{ xs: 12, md: 4 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
            <Image 
                src={siteConfig.logo}
                alt={`${siteConfig.siteName} Logo`}
                width={40} 
                height={40} 
                style={{ marginRight: '10px' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 2, color: 'text.primary' }}>
                {siteConfig.siteName}
            </Typography>
        </Link>
        {siteConfig.slogan && (
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
                {siteConfig.slogan}
            </Typography>
        )}
        {/* RECTIFICATION: Conditional display for aboutUsContent with fallback */}
        <Typography variant="body2" sx={{ maxWidth: '300px', mb: hasSocials ? 3 : 0 }}> {/* Adjusted mb based on social icons presence */}
            {siteConfig.aboutUsContent.title ? `${siteConfig.aboutUsContent.title.substring(0, 150)}...` : t('defaultAboutText')}
        </Typography>
        {/* RECTIFICATION: Conditional rendering for social icons in BrandInfo */}
        {hasSocials && (
          <Box sx={{ mt: 3 }}>
              {siteConfig.social.facebook && (
                  <IconButton aria-label="Facebook" color="inherit" href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /></IconButton>
              )}
              {siteConfig.social.instagram && (
                  <IconButton aria-label="Instagram" color="inherit" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /></IconButton>
              )}
              {siteConfig.social.twitter && (
                  <IconButton aria-label="Twitter" color="inherit" href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer"><TwitterIcon /></IconButton>
              )}
          </Box>
        )}
    </Grid>
  );
};

const FooterLinkColumn = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => {
  // RECTIFICATION: Only render this column if there are links to show
  if (links.length === 0) {
    return null;
  }

  return (
    <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
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
};

const ContactDetails = ({ title }: { title: string }) => {
  // RECTIFICATION: Only render this Grid column if there is ANY contact info
  const hasContactInfo = 
    siteConfig.contact.address ||
    siteConfig.contact.phone ||
    siteConfig.contact.whatsappNumber ||
    siteConfig.contact.email; // Socials are in BrandInfo for this theme

  if (!hasContactInfo) {
    return null; // Don't render the entire column if no contact details are present
  }

  return (
    <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
        <Typography 
            variant="overline" 
            sx={{ fontWeight: 'bold', color: 'text.primary', letterSpacing: '0.08em', mb: 2, display: 'block' }}
        >
            {title}
        </Typography>
        <Stack spacing={1.5}>
            {siteConfig.contact.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mt: '3px', color: 'text.primary' }} />
                    <Typography sx={{ color: 'text.secondary' }}>{siteConfig.contact.address}</Typography>
                </Box>
            )}
            {siteConfig.contact.phone && (
                <Link href={`tel:${siteConfig.contact.phone}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        <Typography sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{siteConfig.contact.phone}</Typography>
                    </Box>
                </Link>
            )}
            {siteConfig.contact.whatsappNumber && (
                <Link href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsAppIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        <Typography sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{siteConfig.contact.whatsappNumber}</Typography>
                    </Box>
                </Link>
            )}
            {siteConfig.contact.email && (
                <Link href={`mailto:${siteConfig.contact.email}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        <Typography sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{siteConfig.contact.email}</Typography>
                    </Box>
                </Link>
            )}
        </Stack>
    </Grid>
  );
};

const CopyrightBar = ({ t }: { t: any }) => (
    <>
        <Divider sx={{ mb: 3 }}/>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}> {/* Added color for consistency */}
                &copy; {new Date().getFullYear()} {siteConfig.brandName}. {t('allRightsReserved')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* RECTIFICATION: Use consistent href and translation keys (t_nav or dedicated footer keys) */}
                <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{t('privacyPolicyLink')}</Typography> {/* Changed to privacyPolicyLink */}
                </Link>
                <Link href="/terms-of-use" style={{ textDecoration: 'none' }}> {/* Changed href to /terms-of-use */}
                    <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>{t('termsOfUseLink')}</Typography> {/* Changed to termsOfUseLink */}
                </Link>
            </Box>
        </Box>
    </>
);


// --- Main Footer Component ---

export default function LuxuryFooter() { // Renamed to LuxuryFooter for clarity
  const t = useTranslations('Footer');
  const t_nav = useTranslations('Header'); // Keep using Header translations for nav links
  const pathname = usePathname();
  
  // RECTIFICATION: Conditional map display logic
  const showMap = 
    pathname !== '/contact' && 
    siteConfig.contact.latitude !== undefined && 
    siteConfig.contact.latitude !== null &&
    siteConfig.contact.longitude !== undefined &&
    siteConfig.contact.longitude !== null &&
    (siteConfig.contact.latitude !== 0 || siteConfig.contact.longitude !== 0); // Only show if explicit non-zero coordinates exist

  // RECTIFICATION: Dynamically build companyLinks based on siteConfig flags
  const dynamicCompanyLinks = (t_nav: any) => {
    const links = [
      { href: '/about', label: t_nav('about') },
    ];
    if (siteConfig.hasReviewsSystem) {
      links.push({ href: '/reviews', label: t_nav('reviewsLink') });
    }
    if (siteConfig.hasBlogSystem) {
      links.push({ href: '/blog', label: t_nav('blogLink') });
    }
    if (siteConfig.hasFaqSection) {
      links.push({ href: '/faq', label: t_nav('faqLink') });
    }
    links.push({ href: '/contact', label: t_nav('contact') });
    return links;
  };

  // RECTIFICATION: Dynamically build exploreLinks based on siteConfig flags
  const dynamicExploreLinks = (t_nav: any) => {
    const links = [];
    if (siteConfig.hasExperiencesSection) {
      links.push({ href: '/experiences', label: t_nav('experiencesLink') }); // Changed label to use t_nav
      // Add more specific experience type links if desired, conditionally
      links.push({ href: '/experiences?style=cultural', label: 'Cultural Tours' });
      links.push({ href: '/experiences?style=adventure', label: 'Adventure Treks' });
    }
    return links;
  };


  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.secondary',
        py: { xs: 8, md: 12 },
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        {/* --- Top Row: Information Columns --- */}
        <Grid container spacing={5} justifyContent="space-between" sx={{ mb: 8 }}>
          <BrandInfo t={t} /> {/* Pass t to BrandInfo */}
          <FooterLinkColumn title={t('companyTitle')} links={dynamicCompanyLinks(t_nav)} /> {/* Use dynamic links */}
          <FooterLinkColumn title={t('exploreTitle')} links={dynamicExploreLinks(t_nav)} /> {/* Use dynamic links */}
          <ContactDetails title={t('contactUsTitle')} />
        </Grid>

        {/* --- Map Section --- */}
        {showMap && (
          <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mb: 6, border: '1px solid', borderColor: 'rgba(255,255,255,0.1)' }}>
              <InteractiveMap latitude={siteConfig.contact.latitude || 0} longitude={siteConfig.contact.longitude || 0} />
          </Box>
        )}

        {/* --- Bottom Bar: Copyright & Legal Links --- */}
        <CopyrightBar t={t} />
      </Container>
    </Box>
  );
}