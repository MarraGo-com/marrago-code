// /src/themes/luxury/ui/Header.tsx
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
import MainHeaderNavigation from './MainHeaderNavigation';
import SearchBar from './SearchBar';
import { siteConfig } from '@/config/site';
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

    const navLinks = [
        { text: t('experiences'), href: '/experiences' },
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
      {/* --- THIS IS THE KEY CHANGE --- */}
            {/* Bottom part of the drawer with the logo */}
            <Box sx={{ textAlign: 'center', py: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Image 
                        src="/favicon.ico" 
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
                    // --- FIX #2: Set the zIndex to be on top of other content but below the Drawer ---
                    zIndex: (theme) => theme.zIndex.drawer - 1,
                }}
            >
                <Container maxWidth="lg" sx={{ px: '0 !important' }}>
                    {isMobile ? (
                        // --- Mobile & Tablet Header ---
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
                        // --- Desktop Header ---
                        <>
                            <TopHeader textColor={headerTextColor} />
                            <MainHeaderNavigation 
                                textColor={headerTextColor}
                                isMenuOpen={isMenuOpen}
                                setActiveMenu={setActiveMenu}
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
                    // The Drawer component itself has a very high z-index by default,
                    // so it will now correctly appear on top of the AppBar.
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}