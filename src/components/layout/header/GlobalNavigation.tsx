// src/components/layout/header/GlobalNavigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Box, Button, IconButton, 
  Avatar, useScrollTrigger, useTheme, alpha, 
  Typography, Skeleton, Tooltip 
} from '@mui/material';
import { Search, Menu as MenuIcon, Person, PersonOutline } from '@mui/icons-material'; 
import { Link, useRouter, usePathname } from '@/i18n/navigation'; 
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// --- CONTEXT ---
import { useAuth } from '@/contexts/AuthContext'; 

// --- CUSTOM COMPONENTS ---
import MegaMenu from './MegaMenu'; 
import MobileNav from './MobileNav';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { siteConfig } from '@/config/client-data';
import FloatingConcierge from '@/components/ui/FloatingConcierge';

export default function GlobalNavigation() {
  const t = useTranslations('Header'); 
  const theme = useTheme();
  const router = useRouter(); 
  const pathname = usePathname(); 
  
  // 2. GET AUTH STATE
  const { user, loading } = useAuth(); 

  // --- SCROLL & STYLE LOGIC ---
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === '/'; 
  const shouldShowSolid = isScrolled || !isHome; 

  useEffect(() => { setIsScrolled(trigger); }, [trigger]);

  const navStyle = {
    bgcolor: shouldShowSolid ? alpha(theme.palette.background.paper, 0.98) : 'transparent', 
    backdropFilter: shouldShowSolid ? 'blur(20px)' : 'none',
    borderBottom: shouldShowSolid ? `1px solid ${theme.palette.divider}` : 'none',
    boxShadow: shouldShowSolid ? theme.shadows[1] : 'none',
    color: theme.palette.text.primary, // Always dark text for readability, or adjust based on theme
    transition: 'all 0.3s ease',
    py: isScrolled ? 1 : 2
  };

  // Using the same logo logic for consistency
  const logoSrc = siteConfig.logo;

  // --- MENU STATE ---
  const [activeMenu, setActiveMenu] = useState<'destinations' | 'interests' | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = (menu: 'destinations' | 'interests') => {
    clearTimeout(timeoutId);
    setActiveMenu(menu);
    setMenuVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => { setMenuVisible(false); setActiveMenu(null); }, 200); 
  };
  const handleCloseMenu = () => { setMenuVisible(false); setActiveMenu(null); };
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- PROFILE CLICK ---
  const handleProfileClick = () => {
    if (user) {
        router.push('/account'); 
    } else {
        router.push('/login');
    }
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={navStyle}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1600px', width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
          
          {/* A. BRAND ZONE */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ position: 'relative', width: 40, height: 40, mr: 1.5 }}>
               <Image src={logoSrc} alt={siteConfig.siteName} fill style={{ objectFit: 'contain' }} sizes="40px" priority />
            </Box>
            <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: -0.5, fontFamily: '"Playfair Display", serif', display: { xs: 'none', sm: 'block' } }}>
                {siteConfig.brandName}
            </Typography>
          </Link>

          {/* B. CENTER ZONE */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button color="inherit" onMouseEnter={() => handleMouseEnter('destinations')} sx={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'none', px: 2 }}>
                {t('navDestinations')}
            </Button>
            <Button color="inherit" onMouseEnter={() => handleMouseEnter('interests')} sx={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'none', px: 2 }}>
                {t('navInterests')}
            </Button>
            <Link href="/blog" passHref>
                <Button color="inherit" sx={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'none', px: 2 }}>
                    {t('navJournal')}
                </Button>
            </Link>
          </Box>

          {/* C. RIGHT ZONE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <IconButton color="inherit" aria-label={t('ariaSearch')} sx={{ display: { xs: 'none', md: 'flex' } }} onClick={() => router.push('/experiences')}>
                <Search />
             </IconButton>
             <Box sx={{ mx: 1 }}>
                <LanguageSwitcher />
             </Box>
             
             {/* ACTIONS */}
             <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, ml: 1 }}>
                
                {/* DYNAMIC AVATAR */}
                {loading ? (
                    <Skeleton variant="circular" width={32} height={32} />
                ) : (
                    <Tooltip title={user ? "My Account" : "Sign In"}>
                        <Avatar 
                            onClick={handleProfileClick} 
                            src={user?.photoURL || undefined} 
                            sx={{ 
                                width: 32, height: 32, 
                                bgcolor: shouldShowSolid ? 'action.hover' : 'rgba(255,255,255,0.2)', 
                                color: 'inherit',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.1)' }
                            }} 
                        >
                            {!user && (shouldShowSolid ? <Person /> : <PersonOutline />)}
                        </Avatar>
                    </Tooltip>
                )}
                
                <Button 
                    variant="contained" 
                    component={Link}
                    href="/planning"
                    sx={{ 
                        borderRadius: 50, px: 3, py: 1, 
                        textTransform: 'none', fontWeight: 'bold', 
                        boxShadow: shouldShowSolid ? 2 : 0,
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.05)' }
                    }}
                >
                    {t('ctaPlanTrip')}
                </Button>
             </Box>

             <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ display: { xs: 'flex', md: 'none' } }}>
                <MenuIcon />
             </IconButton>
          </Box>

        </Toolbar>
        
        <MegaMenu 
            activeMenu={activeMenu} 
            visible={menuVisible} 
            onMouseEnter={() => clearTimeout(timeoutId)} 
            onMouseLeave={handleMouseLeave}
            onClose={handleCloseMenu} 
        />
      </AppBar>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      {/* THE NEW WORLD CLASS CONCIERGE (Replaces FloatingWhatsApp) */}
      <FloatingConcierge />
    </>
  );
}