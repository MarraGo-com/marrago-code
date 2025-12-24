'use client';

import { 
    AppBar, 
    Box, 
    Container, 
    Divider, 
    Drawer, 
    IconButton, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    Toolbar, 
    Typography, 
    useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import TopHeader from './TopHeader';
import MainHeaderNavigation from './MainHeaderNavigation'; // We will pass navLinks to this
import SearchBar from './SearchBar';
import { siteConfig } from '@/config/client-data';
import { useEffect, useState } from 'react';
import LogOutButton from '@/components/auth/LogOutButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

export default function Header() {
    const t = useTranslations('Header');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user] = useAuthState(auth);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const isMenuOpen = activeMenu !== null;
    const isHeaderSolid = isScrolled || isMenuOpen || mobileOpen;
    const headerTextColor = isHeaderSolid ? 'text.primary' : 'common.white';

    // 1. Conditionally build navLinks based on siteConfig for the Luxury theme
    const navLinks = [];
    if (siteConfig.hasExperiencesSection) {
        navLinks.push({ text: t('experiences'), href: '/experiences' });
    }
    navLinks.push({ text: t('about'), href: '/about' }); 
    if (siteConfig.hasBlogSystem) {
        navLinks.push({ text: t('blogLink'), href: '/blog' });
    }
    if (siteConfig.hasReviewsSystem) {
        navLinks.push({ text: t('reviews'), href: '/reviews' }); // Assuming /reviews page exists
    }
    if (siteConfig.hasFaqSection) {
        navLinks.push({ text: t('faq'), href: '/faq' }); // Assuming /faq page exists
    }
    navLinks.push({ text: t('contact'), href: '/contact' }); // Contact is always present

const drawer = (
    <Box sx={{ textAlign: 'start', bgcolor: 'background.default', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
        <Typography variant="h6" sx={{ ml: 1 }}>{t('mobileMenuTitle')}</Typography>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List>
        {/* Render navLinks (now built conditionally) for mobile */}
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
      
      {/* Bottom part of the drawer with the logo */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Divider sx={{ mb: 3 }} />
        <Link href="/" style={{ textDecoration: 'none' }}>
            <Image 
                src= {siteConfig.logo} 
                alt={`${siteConfig.siteName} logo`}
                width={40} 
                height={40} 
            />
        </Link>
      </Box>
    </Box>
);

    return (
        <>
            <AppBar 
                position="absolute"
                elevation={0}
                onMouseLeave={() => !isMobile && setActiveMenu(null)}
                sx={{
                    backgroundColor: isHeaderSolid ? 'background.default' : 'transparent',
                    color: headerTextColor,
                    boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.3s ease-in-out',
                    zIndex: (theme) => theme.zIndex.drawer - 1,
                }}
            >
                <Container maxWidth="lg" sx={{ px: '0 !important' }}>
                    {isMobile ? (
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" color="inherit" sx={{ flexGrow: 1, textAlign: 'center' }}>
                               {siteConfig.siteName}
                            </Typography>
                            <Box sx={{ width: 48 }} /> 
                        </Toolbar>
                    ) : (
                        <>
                            <TopHeader textColor={headerTextColor} />
                            <MainHeaderNavigation 
                                textColor={headerTextColor}
                                isMenuOpen={isMenuOpen}
                                setActiveMenu={setActiveMenu}
                                navLinks={navLinks} 
                            />
                            <SearchBar />
                        </>
                    )}
                </Container>
            </AppBar>
            
            <Drawer
                component="nav"
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}