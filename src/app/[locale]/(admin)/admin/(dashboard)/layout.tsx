// src/app/[locale]/admin/(dashboard)/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useAppRouter } from '@/hooks/router/useAppRouter';
import { 
  Box, 
  CircularProgress, 
  Container, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from '@/components/admin/AdminSidebar';

const drawerWidth = 240;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useAppRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // --- Mobile Drawer State ---
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // --- Auth Verification ---
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!loading && !user) {
        router.push('/admin/login');
        return;
      }
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          if (idTokenResult.claims.admin === true) {
            setIsAdmin(true);
          } else {
            router.push('/');
          }
        } catch (e) {
          router.push('/admin/login');
        } finally {
          setIsVerifying(false);
        }
      } else if (!loading) {
        setIsVerifying(false);
      }
    };
    verifyAdminStatus();
  }, [user, loading, router]);

  // --- Loading State ---
  if (loading || isVerifying) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          bgcolor: 'background.default' // Replaced #030303
        }}
      >
        {/* Replaced #D97706 with theme primary color */}
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  // --- Authenticated State ---
  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        
        {/* --- MOBILE HEADER --- */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.default', // Replaced #030303
            borderBottom: 1,               // Shorthand for border-width
            borderColor: 'divider',        // Replaced rgba(255,255,255,0.1)
            display: { sm: 'none' }, 
            boxShadow: 'none',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' },
                color: 'text.primary' // 👈 FIX: Forces icon to adapt (Black in Light / White in Dark)
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                color: 'text.primary', // Replaced 'white'
                fontWeight: 'bold' 
              }}
            >
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>

        {/* --- SIDEBAR --- */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <AdminSidebar 
            mobileOpen={mobileOpen} 
            handleDrawerTransitionEnd={handleDrawerTransitionEnd}
            handleDrawerClose={handleDrawerClose}
            drawerWidth={drawerWidth}
          />
        </Box>

        {/* --- MAIN CONTENT --- */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            color: 'text.primary', // Replaced 'white'
            minHeight: '100vh',
            overflowX: 'hidden'
          }}
        >
          {/* Spacer for the AppBar on mobile */}
          <Toolbar sx={{ display: { sm: 'none' } }} />
          
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>
      </Box>
    );
  }

  return null;
}