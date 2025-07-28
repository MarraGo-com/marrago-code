// /src/components/ui/Header.tsx
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
import LogOutButton from '../auth/LogOutButton';
// Removed unused import 'locations'
import Image from 'next/image';
import AnimatedMenuIcon from './AnimatedMenuIcon';
import MegaMenuPanel from './MegaMenuPanel';
import { AnimatePresence } from 'framer-motion';
import AnimatedLink from './AnimatedLink'; // <-- 1. Import the AnimatedLink component
import { siteConfig } from '@/config/site';

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
            bgcolor: isScrolled || isMenuHovered ? 'background.paper' : 'transparent',
            boxShadow: isScrolled || isMenuHovered ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
            transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            borderBottom: 1,
            borderColor: isScrolled || isMenuHovered ? 'divider' : 'transparent',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              px: '0 !important',
              color: isScrolled || isMenuHovered ? 'text.primary' : 'text.secondary',
              transition: 'color 0.3s ease-in-out',
            }}>
              
              {isMobileOrTablet && (
                <Box sx={{ zIndex: 1400 }}>
                  <AnimatedMenuIcon isOpen={mobileOpen} onClick={handleDrawerToggle} />
                </Box>
              )}

              <Box sx={{ flexGrow: { xs: 1, md: 0 }, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                  <Image src="/favicon.ico"  alt={siteConfig.brandName} width={40} height={40} priority style={{ marginRight: '1rem' }} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {siteConfig.siteName}
                  </Typography>
                </Link>
              </Box>

              {!isMobileOrTablet && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1, justifyContent: 'flex-end' }}>
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
                  
                  {/* --- 2. THIS IS THE KEY FIX --- */}
                  {/* We replace the standard Buttons with our new AnimatedLink component */}
                  {navLinks.map((link) => (
                    <AnimatedLink key={link.text} href={link.href}>
                      <Typography sx={{ fontWeight: 500 }}>{link.text}</Typography>
                    </AnimatedLink>
                  ))}
                  
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
