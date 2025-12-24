// src/app/[locale]/sitemap/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { Container, Box, Typography, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import { Link } from '@/i18n/navigation';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { siteConfig } from '@/config/client-data';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// --- METADATA IMPORTS ---

import { generateStaticPageMetadata } from '@/lib/metadata';
import { getStaticPageMetadata } from '@/config/static-metadata';
import { WebsiteLanguage } from '@/config/types';

// Define params type for Next.js 15+
type MetadataParams = Promise<{ locale: WebsiteLanguage }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  // Fetch the metadata specifically for 'sitemap'
  const metadata = getStaticPageMetadata('sitemap', locale); 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://marrago.com",
  });
}

export default function SitemapPage() {
  
  // 1. Define your Static Pages
  const staticPages = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'All Experiences', href: '/experiences' },
    { label: 'Travel Journal (Blog)', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Terms of Use', href: '/terms-of-use' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    // Added new pages to the visible sitemap
    { label: 'Plan Your Trip', href: '/planning' }, 
  ];

  // 2. Get Destinations from Config
  // FIX: Force cast to string to fix 'never' error and add explicit type (s: string)
  const locationsString = siteConfig.tourLocationsServed as unknown as string;
  const destinations: string[] = locationsString && typeof locationsString === 'string'
    ? locationsString.split(',').map((s: string) => s.trim()) 
    : [];

  // 3. Define Categories
  const categories = [
    { label: 'Surf Coaching', href: '/experiences?category=surf' },
    { label: 'Desert Tours', href: '/experiences?category=desert' },
    { label: 'City Tours', href: '/experiences?category=culture' },
    { label: 'Hammam & Wellness', href: '/experiences?category=wellness' },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        
        {/* --- FIXED HEADER SECTION --- */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
            <MainHeadingUserContent
                title="Sitemap"
                component="h1"
                variant="h2"
                sx={{ mb: 2, textShadow: 'none', color: 'text.primary' }} 
            />
            
            <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: '600px', mx: 'auto', fontWeight: 400 }}
            >
                Overview of all pages and destinations on MarraGo.
            </Typography>
        </Box>

        <Grid container spacing={4}>
            
            {/* COLUMN 1: MAIN PAGES */}
            <Grid  size={{xs: 12, md: 4}}>
                <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                        Main Pages
                    </Typography>
                    <List>
                        {staticPages.map((page) => (
                            <ListItem key={page.href} disablePadding sx={{ mb: 1.5 }}>
                                <Link href={page.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                    <ArrowForwardIosIcon sx={{ fontSize: 12, mr: 1, color: 'text.secondary' }} />
                                    <ListItemText 
                                        primary={page.label} 
                                        primaryTypographyProps={{ 
                                            variant: 'body1', 
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            sx: { '&:hover': { color: 'primary.main' } }
                                        }} 
                                    />
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>

            {/* COLUMN 2: EXPERIENCE CATEGORIES */}
            <Grid  size={{xs: 12, md: 4}}>
                <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                        Experience Categories
                    </Typography>
                    <List>
                        {categories.map((cat) => (
                            <ListItem key={cat.href} disablePadding sx={{ mb: 1.5 }}>
                                <Link href={cat.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                    <ArrowForwardIosIcon sx={{ fontSize: 12, mr: 1, color: 'text.secondary' }} />
                                    <ListItemText 
                                        primary={cat.label} 
                                        primaryTypographyProps={{ 
                                            variant: 'body1', 
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            sx: { '&:hover': { color: 'primary.main' } }
                                        }} 
                                    />
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>

            {/* COLUMN 3: DESTINATIONS */}
            <Grid size={{xs: 12, md: 4}}>
                <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                        Destinations
                    </Typography>
                    <List>
                        {destinations.sort().map((city) => (
                            <ListItem key={city} disablePadding sx={{ mb: 1.5 }}>
                                <Link href={`/experiences?q=${city}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                    <ArrowForwardIosIcon sx={{ fontSize: 12, mr: 1, color: 'text.secondary' }} />
                                    <ListItemText 
                                        primary={city} 
                                        primaryTypographyProps={{ 
                                            variant: 'body1', 
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            sx: { '&:hover': { color: 'primary.main' } }
                                        }} 
                                    />
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>

        </Grid>
      </Container>
    </Box>
  );
}