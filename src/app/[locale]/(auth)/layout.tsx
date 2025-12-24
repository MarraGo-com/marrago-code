'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Fade } from '@mui/material';
import Image from 'next/image';
import { siteConfig } from '@/config/client-data';
import Link from 'next/link';
import { useTranslations } from 'next-intl'; // <--- Import Hook

// --- THE DREAM COLLECTION (Sources Only) ---
// We only keep the visual data here. Text is now in messages/en.json
const DREAM_IMAGES = [
  // Index 0: Sahara
  { src: "/images/sahara-expedition-sunset.webp" },
  // Index 1: Secret Riad
  { src: "/images/mock/about-us-palais-cherifiens.webp" }, 
  // Index 2: Doorway
  { src: "/images/mock/palais-cherifiens-marrakech-courtyard.webp" }
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AuthLayout'); // <--- Initialize Hook
  
  // 1. STATE MANAGEMENT
  // Track the INDEX (0, 1, 2) instead of the object, so we can look up translations easily
  const [activeIndex, setActiveIndex] = useState(0); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Randomize only on the client side
    const randomIndex = Math.floor(Math.random() * DREAM_IMAGES.length);
    setActiveIndex(randomIndex);
    setMounted(true);
  }, []);

  const currentImage = DREAM_IMAGES[activeIndex];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        
        {/* === LEFT: THE DREAM (Image) === */}
        <Grid size={{ xs: false, md: 7, lg: 8 }} sx={{ position: 'relative', display: { xs: 'none', md: 'block' }, bgcolor: 'black' }}>
           
           <Fade in={mounted} timeout={1000}>
             <Box sx={{ position: 'absolute', inset: 0 }}>
               <Image
                 src={currentImage.src} 
                 // Localized Alt Text based on active index
                 alt={t(`images.${activeIndex}.alt`)}
                 fill
                 priority
                 style={{ objectFit: 'cover', opacity: 0.9 }} 
               />
             </Box>
           </Fade>

           <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)' }} />
           
           <Box sx={{ position: 'absolute', bottom: 60, left: 60, right: 60, color: 'white', zIndex: 2 }}>
              <Typography variant="h3" fontWeight="800" sx={{ mb: 2, fontFamily: '"Playfair Display", serif', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                {siteConfig.brandName}
              </Typography>
              
              {/* Localized Dynamic Quote */}
              <Typography variant="h5" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)', opacity: 0.95, fontWeight: 500 }}>
                "{t(`images.${activeIndex}.quote`)}"
              </Typography>
           </Box>
        </Grid>

        {/* === RIGHT: THE DOOR (Form) === */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
           
           {/* Mobile Logo */}
           <Box sx={{ position: 'absolute', top: 24, left: 24, display: { md: 'none' } }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                 <Typography variant="h6" fontWeight="bold" color="primary">{siteConfig.brandName}</Typography>
              </Link>
           </Box>
           
           {/* Desktop Close Button */}
           <Box sx={{ position: 'absolute', top: 32, right: 32, display: { xs: 'none', md: 'block' } }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'gray', fontSize: '0.875rem', fontWeight: 600 }}>
                 ✕ {t('close')}
              </Link>
           </Box>

           <Box sx={{ p: { xs: 4, sm: 6, md: 8 }, maxWidth: 600, mx: 'auto', width: '100%' }}>
              {children}
           </Box>
        </Grid>

      </Grid>
    </Box>
  );
}