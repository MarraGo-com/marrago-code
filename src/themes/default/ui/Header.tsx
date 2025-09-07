'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemText, Divider, Container, CircularProgress
} from '@mui/material';
import { Link } from '@/i18n/navigation';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import LogOutButton from '@/components/auth/LogOutButton';
import Image from 'next/image';
import AnimatedMenuIcon from './AnimatedMenuIcon';
import MegaMenuPanel from './MegaMenuPanel';
import { AnimatePresence } from 'framer-motion';
import AnimatedLink from './AnimatedLink';
import { siteConfig } from '@/config/site';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [user, loading] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };

  const navLinks = [
    { text: t('about'), href: '/about' },
    { text: t('blogLink'), href: '/blog' },
    { text: t('contact'), href: '/contact' },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'start', bgcolor: 'background.default', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
        <Typography variant="h6" sx={{ ml: 1 }}>{t('mobileMenuTitle')}</Typography>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/experiences" sx={{ textAlign: 'start' }} onClick={handleDrawerToggle}>
            <ListItemText primary={t('experiences')} />
          </ListItemButton>
        </ListItem>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={Link} href={link.href} sx={{ textAlign: 'start' }} onClick={handleDrawerToggle}>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ px: 2, py: 1 }}>
          <LanguageSwitcher />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        {user ? (
          <ListItem disablePadding sx={{ display: 'flex', justifyContent: 'start', px: 2 }}>
            <LogOutButton />
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/admin/login" sx={{ textAlign: 'start' }} onClick={handleDrawerToggle}>
              <ListItemText primary={t('login')} sx={{ color: 'primary.main', fontWeight: 'bold' }} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Box onMouseLeave={() => setIsMenuHovered(false)} sx={{ position: 'relative' }}>
        <AppBar 
          position="sticky"
          elevation={0}
          sx={{
            zIndex: theme.zIndex.appBar,
            bgcolor: isScrolled || isMenuHovered 
              ? 'background.paper' 
              : theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(0, 0, 0, 0.9)',
            backdropFilter: isScrolled || isMenuHovered ? 'none' : 'blur(10px)',
            boxShadow: isScrolled || isMenuHovered ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
            transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
            borderBottom: 1,
            borderColor: isScrolled || isMenuHovered 
              ? 'divider' 
              : theme.palette.mode === 'light' 
                ? 'rgba(0,0,0,0.1)' 
                : 'rgba(255,255,255,0.1)',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              px: '0 !important',
              color: isScrolled || isMenuHovered 
                ? 'text.primary' 
                : theme.palette.mode === 'light' 
                  ? 'text.primary'
                  : 'white',
              transition: 'color 0.3s ease-in-out',
            }}>
              
              {/* --- CHANGE 1: Logo and Title moved to the beginning and aligned left --- */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                  <Image 
                    src="/favicon.ico"  
                    alt="" 
                    width={40} 
                    height={40} 
                    priority 
                    fetchPriority='high'
                    style={{ marginRight: '1rem' }} 
                    sizes="40px"
                  />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {siteConfig.siteName}
                  </Typography>
                </Link>
              </Box>
              
              {/* --- CHANGE 2: Content is now split for mobile vs. desktop --- */}
              {isMobileOrTablet ? (
                // On Mobile: Display the hamburger button on the right
                <Box sx={{ zIndex: 1400 }}>
                  <AnimatedMenuIcon isOpen={mobileOpen} onClick={handleDrawerToggle} />
                </Box>
              ) : (
                // On Desktop: Display the navigation links and buttons on the right
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Button
                    color="inherit"
                    onMouseEnter={() => setIsMenuHovered(true)}
                    endIcon={<ArrowDropDownIcon />}
                    component={Link}
                    href="/experiences"
                    sx={{ fontWeight: 500 }}
                  >
                    {t('experiences')}
                  </Button>
                  
                  {navLinks.map((link) => (
                    <AnimatedLink key={link.text} href={link.href}>
                      <Typography sx={{ fontWeight: 500 }}>{link.text}</Typography>
                    </AnimatedLink>
                  ))}
                  
                  <LanguageSwitcher />

                  <Box sx={{ ml: 2 }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : user ? <LogOutButton /> : (
                      <Button variant="contained" color="primary" component={Link} href="/admin/login">
                        {t('login')}
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Toolbar>
          </Container>

          <AnimatePresence>
            {isMenuHovered && !isMobileOrTablet && <MegaMenuPanel />}
          </AnimatePresence>
        </AppBar>
      </Box>

      <nav>
        <Drawer variant="temporary" anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }}}>
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}
