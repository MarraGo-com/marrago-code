// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/ui/PageLoader.tsx
// This component is the beautiful, full-screen loading animation.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import Image from 'next/image';

export default function PageLoader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ textAlign: 'center' }}
      >
         <Image
          src="/favicon.ico" // Using your site's favicon as the logo
          alt={`${siteConfig.siteName} Logo`}
          width={80}
          height={80}
          // --- THIS IS THE KEY FIX ---
          // We prioritize this image to ensure the loader appears quickly.
          priority 
          fetchPriority='high'
        />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading...
        </Typography>
      </motion.div>
    </Box>
  );
}