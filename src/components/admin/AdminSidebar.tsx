// src/components/admin/AdminSidebar.tsx
'use client';

import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Divider, 
  Box, 
  Typography,
  useTheme 
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // 👈 Import alpha for dynamic transparency
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline'; 
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  handleDrawerTransitionEnd?: () => void;
  handleDrawerClose?: () => void;
  drawerWidth?: number;
}

export default function AdminSidebar({ 
  mobileOpen = false, 
  handleDrawerTransitionEnd, 
  handleDrawerClose,
  drawerWidth = 240 
}: AdminSidebarProps) {
  
  const t = useTranslations('admin.AdminSidebar');
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme(); // 👈 Access the theme

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  // --- MENU ITEMS CONFIGURATION (Localized) ---
  const menuItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: t('experiences'), icon: <BookOnlineIcon />, path: '/admin/experiences' },
    { text: t('bookings'), icon: <EventNoteIcon />, path: '/admin/bookings' },
    { text: t('blog'), icon: <ArticleIcon />, path: '/admin/blog' },
    { text: t('reviews'), icon: <RateReviewIcon />, path: '/admin/reviews' },
  ];

  const drawerContent = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.paper', // Replaced #0A0A0A
        color: 'text.primary'        // Replaced 'white'
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderBottom: 1, 
          borderColor: 'divider' // Replaced rgba(255,255,255,0.1)
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          MarraGo <span style={{ color: theme.palette.primary.main, fontSize: '0.8em' }}>ADMIN</span>
        </Typography>
      </Toolbar>
      
      <Divider /> {/* Default Divider uses theme colors automatically */}
      
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname.includes(item.path);
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={handleDrawerClose} 
                sx={{
                  borderRadius: 2,
                  // Dynamic Background: Uses primary color with opacity if active
                  bgcolor: isActive 
                    ? alpha(theme.palette.primary.main, 0.15) 
                    : 'transparent',
                  // Dynamic Text Color
                  color: isActive 
                    ? 'primary.main' 
                    : 'text.secondary', // Replaced rgba(255,255,255,0.7)
                  '&:hover': {
                    bgcolor: alpha(theme.palette.action.hover, 0.1), // Standard MUI hover
                    color: 'text.primary',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    // Dynamic Icon Color
                    color: isActive 
                      ? 'primary.main' 
                      : 'text.secondary', // Replaced rgba(255,255,255,0.5)
                    minWidth: 40 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem', 
                    fontWeight: isActive ? 600 : 400 
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      
      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ 
              borderRadius: 2, 
              color: 'error.main', // Replaced #ef4444
              '&:hover': { 
                bgcolor: alpha(theme.palette.error.main, 0.1) // Dynamic red hover
              } 
            }}
          >
            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('logout')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            borderRight: 1, 
            borderColor: 'divider' 
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            borderRight: 1, 
            borderColor: 'divider' 
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}