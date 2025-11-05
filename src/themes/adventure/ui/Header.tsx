// /src/themes/adventure/ui/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemText, Divider, Container, CircularProgress
} from '@mui/material';
import { Link } from '@/i18n/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import LogOutButton from '@/components/auth/LogOutButton';
import Image from 'next/image';
import AnimatedMenuIcon from './AnimatedMenuIcon';
import AnimatedLink from './AnimatedLink';
import { siteConfig } from '@/config/client-data';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [user, loading] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };

  // 1. Conditionally build navLinks based on siteConfig for the Adventure theme
  const navLinks = [];

  if (siteConfig.hasExperiencesSection) { // Experiences is explicitly first in adventure navLinks
    navLinks.push({ text: t('experiences'), href: '/experiences' });
  }
  navLinks.push({ text: t('about'), href: '/about' }); // 'About' is always present
  
  if (siteConfig.hasBlogSystem) {
    navLinks.push({ text: t('blogLink'), href: '/blog' });
  }
  if (siteConfig.hasReviewsSystem) {
    navLinks.push({ text: t('reviews'), href: '/reviews' }); // Assuming /reviews page exists
  }
  if (siteConfig.hasFaqSection) {
    navLinks.push({ text: t('faq'), href: '/faq' }); // Assuming /faq page exists
  }
  // Add Contact if it's supposed to be in the main nav for adventure theme,
  // it wasn't there before, but often is.
  // navLinks.push({ text: t('contact'), href: '/contact' }); 

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', bgcolor: 'background.default' }}>
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
                <Typography variant="h6" sx={{ ml: 1 }}>{t('mobileMenuTitle')}</Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {/* Render navLinks (now built conditionally) for mobile */}
                {navLinks.map((link) => (
                    <ListItem key={link.text} disablePadding>
                        <ListItemButton component={Link} href={link.href} sx={{ textAlign: 'start', py: 1.5 }} onClick={handleDrawerToggle}>
                            <ListItemText primary={link.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
        
        <Box>
            <Divider sx={{ my: 1 }} />
            {user ? (
                <ListItem sx={{ display: 'flex', justifyContent: 'start', px: 2 }}>
                    <LogOutButton />
                </ListItem>
            ) : (
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/admin/login" sx={{ textAlign: 'start' }} onClick={handleDrawerToggle}>
                        <ListItemText primary={t('login')} sx={{ color: 'primary.main', fontWeight: 'bold' }} />
                    </ListItemButton>
                </ListItem>
            )}
            {/* Language switcher for mobile drawer */}
            <ListItem disablePadding sx={{ px: 2, py: 1 }}>
              <LanguageSwitcher />
            </ListItem>
        </Box>
    </Box>
  );
  
  const isHeaderSolid = isScrolled || mobileOpen;

  return (
    <>
      <AppBar 
        position="absolute"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.appBar,
          backgroundColor: isHeaderSolid ? 'background.paper' : 'transparent',
          color: isHeaderSolid ? 'text.primary' : 'common.white',
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
          boxShadow: isHeaderSolid ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            px: '0 !important',
            height: 70,
          }}>
            
            {/* Menu Icon for Mobile */}
            {isMobileOrTablet && (
              <Box sx={{ position: 'absolute', left: 0, zIndex: 1 }}>
                <AnimatedMenuIcon isOpen={mobileOpen} onClick={handleDrawerToggle}/>
              </Box>
            )}

            {/* Brand Logo and Name - Centered on Mobile */}
            <Box sx={{ 
              flexGrow: 1,
              display: 'flex', 
              justifyContent: { xs: 'center', md: 'flex-start' },
              position: 'relative',
              zIndex: 0
            }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                  <Image 
                    src= {siteConfig.logo} 
                    alt= {siteConfig.siteName} 
                    width={40} 
                    height={40} 
                    priority 
                    fetchPriority='high'
                    style={{ 
                        transition: 'filter 0.3s ease-in-out'
                    }}
                  />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', ml: 1.5 }}>
                    {siteConfig.siteName}
                  </Typography>
                </Link>
            </Box>

            {!isMobileOrTablet && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', flexGrow: 1 }}>
                  {/* Render navLinks (now built conditionally) for desktop */}
                  {navLinks.map((link) => (
                    <AnimatedLink key={link.text} href={link.href}>
                      <Typography sx={{ fontWeight: 'bold' }}>{link.text}</Typography>
                    </AnimatedLink>
                  ))}
                </Box>
            )}

            <Box sx={{ minWidth: { md: 200 }, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
                  <LanguageSwitcher />
                </Box>
                {loading ? <CircularProgress size={24} color="inherit" /> : !user && (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        component={Link} 
                        href="/contact" // Original adventure theme had /contact here instead of /admin/login
                        sx={{ 
                            display: { xs: 'none', md: 'block' },
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            px: 3,
                        }}
                    >
                        {t('login')} {/* Still using t('login') for the button text */}
                    </Button>
                )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <nav>
        <Drawer 
            variant="temporary" 
            anchor="left" 
            open={mobileOpen} 
            onClose={handleDrawerToggle} 
            ModalProps={{ keepMounted: true }} 
            sx={{ 
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%', maxWidth: '300px' },
            }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}