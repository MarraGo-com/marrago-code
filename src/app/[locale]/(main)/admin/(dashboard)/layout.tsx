// /src/app/[locale]/admin/(dashboard)/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useAppRouter } from '@/hooks/router/useAppRouter'; // Corrected path
import { Box, CircularProgress, Container } from '@mui/material';
// import LogOutButton from '@/components/auth/LogOutButton';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useAppRouter();
  
  // --- NEW STATE to track if the user has been verified as an admin ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      // If the initial auth check is done and there's no user, redirect immediately.
      if (!loading && !user) {
        router.push('/admin/login');
        return;
      }
      
      // If we have a user, check their custom claims.
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          // Check for the { admin: true } claim.
          if (idTokenResult.claims.admin === true) {
            setIsAdmin(true);
          } else {
            // If the user is not an admin, redirect them away.
            console.warn("Access denied. User is not an admin.");
            router.push('/'); // Redirect to public homepage
          }
        } catch (e) {
          console.error("Error verifying admin token:", e);
          router.push('/admin/login');
        } finally {
          setIsVerifying(false); // Verification process is complete
        }
      } else if (!loading) {
        // Handle the case where there's no user after loading
        setIsVerifying(false);
      }
    };

    verifyAdminStatus();
  }, [user, loading, router]);

  // Show a full-screen loading spinner while checking auth state and verifying claims.
  if (loading || isVerifying) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Only render the admin panel if the user is a verified admin.
  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <LogOutButton />
          </Box> */}
          <Container maxWidth="xl">
            {children}
          </Container>
        </Box>
      </Box>
    );
  }

  // In the brief moment before redirecting a non-admin, show nothing.
  return null; 
}
