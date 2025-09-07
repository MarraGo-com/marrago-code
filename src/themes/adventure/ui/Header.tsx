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
import { siteConfig } from '@/config/site';
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

  const navLinks = [
    { text: t('experiences'), href: '/experiences' },
    { text: t('about'), href: '/about' },
    { text: t('blogLink'), href: '/blog' },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', bgcolor: 'background.default' }}>
        {/* Top part of the drawer */}
        <Box>
            {/* ## FIX #1: Added a proper header with a close button to the drawer ## */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
                <Typography variant="h6" sx={{ ml: 1 }}>{t('mobileMenuTitle')}</Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.text} disablePadding>
                        <ListItemButton component={Link} href={link.href} sx={{ textAlign: 'start', py: 1.5 }} onClick={handleDrawerToggle}>
                            <ListItemText primary={link.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
        
        {/* Bottom part of the drawer for Login/Logout */}
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
          // ## FIX #2: Set the zIndex to be on top of other content but below the Drawer ##
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
            
            <Box sx={{ minWidth: { md: 200 }, display: 'flex', justifyContent: 'flex-start' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                  <Image 
                    src="/favicon.ico" 
                    alt="" 
                    width={40} 
                    height={40} 
                    priority 
                    style={{ 
                      //  filter: !isHeaderSolid ? 'brightness(0) invert(1)' : 'none',
                        transition: 'filter 0.3s ease-in-out'
                    }}
                  />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', ml: 1.5 }}>
                    {siteConfig.siteName}
                  </Typography>
                </Link>
            </Box>

            {isMobileOrTablet ? (
                <AnimatedMenuIcon isOpen={mobileOpen} onClick={handleDrawerToggle}/>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', flexGrow: 1 }}>
                  {navLinks.map((link) => (
                    <AnimatedLink key={link.text} href={link.href}>
                      <Typography sx={{ fontWeight: 'bold' }}>{link.text}</Typography>
                    </AnimatedLink>
                  ))}
                </Box>
            )}

            <Box sx={{ minWidth: { md: 200 }, display: 'flex', justifyContent: 'flex-end' }}>
                {/* --- ADD THE LANGUAGE SWITCHER HERE --- */}
               <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
                  <LanguageSwitcher />
               </Box>
               {loading ? <CircularProgress size={24} color="inherit" /> : !user && (
                  <Button 
                      variant="contained" 
                      color="primary" 
                      component={Link} 
                      href="/contact"
                      sx={{ 
                          display: { xs: 'none', md: 'block' },
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          px: 3,
                      }}
                  >
                    {t('login')}
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
                // The Drawer's default zIndex (1300) is higher than the AppBar's (1100),
                // so it will correctly appear on top.
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%', maxWidth: '300px' },
            }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}