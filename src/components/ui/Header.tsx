// /src/components/ui/Header.tsx
'use client';

import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemText, Divider, Container, Menu, MenuItem, Fade, CircularProgress
} from '@mui/material';
import { Link } from '@/i18n/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';


// --- 1. Import tools to check authentication state --- 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import LogOutButton from '../auth/LogOutButton'; // We reuse the logout button 
import { locations } from '@/config/locations';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations('Header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [user, loading] = useAuthState(auth);

  const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
  const handleMenuClose = () => { setAnchorEl(null); };

  const navLinks = [
    { text: t('about'), href: '/about' },
    { text: t('blogLink'), href: '/blog' },
    { text: t('contact'), href: '/contact' },
  ];

 const drawer = (
    // Remove onClick from this Box to prevent the whole drawer from being a close button
    <Box sx={{ textAlign: 'start', bgcolor: 'background.default', height: '100%' }}>
      {/* Add a header Box to align the title and close button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1.5
      }}>
        <Typography variant="h6" sx={{ ml: 1 }}>{t('mobileMenuTitle')}</Typography>
        {/* Add the close button */}
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/experiences" sx={{ textAlign: 'start' }}>
            <ListItemText primary={t('experiences')} />
          </ListItemButton>
        </ListItem>
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={Link} href={link.href} sx={{ textAlign: 'start' }}>
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
            <ListItemButton component={Link} href="/admin/login" sx={{ textAlign: 'start' }}>
              <ListItemText primary={t('login')} sx={{ color: 'primary.main', fontWeight: 'bold' }} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 'none', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: '0 !important' }}>
            
            {/* --- THIS IS THE KEY CHANGE for Mobile View --- */}
            {isMobileOrTablet && (
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                {/* --- 2. Replace the Box with the optimized Image component --- */}
                <Image
                  src="/favicon.ico"
                  alt={t('siteTitle')}
                  width={40}
                  height={40}
                  priority // Tells Next.js to preload this critical image
                  style={{ marginRight: '1rem' }} // Use inline style for margin
                />

                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {t('siteTitle')}
                </Typography>
              </Link>
            </Box>

            {!isMobileOrTablet && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box onMouseLeave={handleMenuClose}>
                  <Button color="inherit" onMouseEnter={handleMenuOpen} endIcon={<ArrowDropDownIcon />}>
                    {t('experiences')}
                  </Button>
                  <Menu id="experiences-menu" anchorEl={anchorEl} open={open} onClose={handleMenuClose} TransitionComponent={Fade} MenuListProps={{ onMouseLeave: handleMenuClose }}>
                    <MenuItem component={Link} href="/experiences" onClick={handleMenuClose}>{t('allExperiences')}</MenuItem>
                    <Divider />
                    {locations.map((location) => (
                      <MenuItem key={location.id} component={Link} href={`/experiences?location=${location.id}`} onClick={handleMenuClose}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                
                {navLinks.map((link) => (
                  <Button key={link.text} color="inherit" component={Link} href={link.href}>
                    {link.text}
                  </Button>
                ))}
                
                <Box sx={{ ml: 2 }}>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : user ? (
                    <LogOutButton />
                  ) : (
                    <Button variant="contained" color="primary" component={Link} href="/admin/login">
                      {t('login')}
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <nav>
        {/* --- ANOTHER KEY CHANGE: anchor="left" --- */}
        <Drawer variant="temporary" anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }}}>
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}
