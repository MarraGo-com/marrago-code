'use client';

import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton, useTheme, useMediaQuery, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CollectionsIcon from '@mui/icons-material/Collections';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Import Swiper for Mobile Touch Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroMasonryProps {
  coverImage: string;
  galleryImages: { path: string }[];
  title: string;
}

export default function HeroMasonry({ coverImage, galleryImages, title }: HeroMasonryProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  // New: Translation hook
  const t = useTranslations('ExperienceDetails.hero');
  
  const allImages = [coverImage, ...(galleryImages?.map(img => img.path) || [])];
  const displayImages = allImages.slice(0, 5);

  return (
    <>
      <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: { xs: '350px', md: '500px' }, 
          overflow: 'hidden', 
          borderRadius: { xs: 0, md: '24px' },
          mt: { xs: 0, md: 4 }, 
          mb: 4
        }}>
        
        {/* === MOBILE VIEW: SWIPER SLIDER === */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, height: '100%' }}>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
                style={{ width: '100%', height: '100%' }}
            >
                {allImages.slice(0, 8).map((img, index) => (
                    <SwiperSlide key={index}>
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image 
                                src={img} 
                                alt={`${title} ${index}`} 
                                fill 
                                style={{ objectFit: 'cover' }} 
                                priority={index === 0}
                            />
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>

        {/* === DESKTOP VIEW: MASONRY GRID === */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }}>
          <Grid container spacing={1} sx={{ height: '100%' }}>
            
            {/* Main Left Image */}
            <Grid size={6} sx={{ height: '100%', position: 'relative' }}>
               <Image 
                 src={displayImages[0]} 
                 alt="Main view" 
                 fill 
                 style={{ objectFit: 'cover', cursor: 'pointer' }}
                 className="hover:brightness-90 transition-all duration-300"
                 onClick={() => setOpen(true)}
                 priority
               />
            </Grid>
            
            {/* Right Grid */}
            <Grid size={6} container spacing={1} sx={{ height: '100%' }}>
              {displayImages.slice(1, 5).map((img, index) => (
                <Grid key={index} size={6} sx={{ position: 'relative', height: '50%' }}>
                  <Image 
                    src={img} 
                    alt={`Detail ${index}`} 
                    fill 
                    style={{ objectFit: 'cover', cursor: 'pointer' }} 
                    className="hover:brightness-90 transition-all duration-300"
                    onClick={() => setOpen(true)}
                  />
                  {/* Overlay on the last image */}
                  {index === 3 && allImages.length > 5 && (
                    <Box 
                        onClick={() => setOpen(true)}
                        sx={{
                            position: 'absolute', inset: 0, 
                            bgcolor: 'rgba(0,0,0,0.3)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' }
                        }}
                    >
                        <Typography variant="h6" color="white" fontWeight="bold">
                            {t('showAllPhotos')}
                        </Typography>
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Floating Button (Standard UI: White button is readable on photos in both Dark/Light modes) */}
          <Button
            variant="contained"
            startIcon={<CollectionsIcon />}
            onClick={() => setOpen(true)}
            sx={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                bgcolor: 'common.white',
                color: 'common.black',
                boxShadow: theme.shadows[4],
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: '#f7f7f7' }
            }}
            >
            {t('showAllPhotos')}
           </Button>
        </Box>
      </Box>

      {/* === FULL SCREEN LIGHTBOX === */}
      <Dialog 
        fullScreen 
        open={open} 
        onClose={() => setOpen(false)}
        sx={{ zIndex: 9999 }}
      >
        <Box sx={{ position: 'relative', bgcolor: 'black', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <IconButton onClick={() => setOpen(false)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                    <CloseIcon />
                </IconButton>
                <Typography color="white" variant="subtitle1">{title}</Typography>
                <Box width={40} />
            </Box>

            {/* Gallery Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 0, md: 4 } }}>
                 <Grid container spacing={2} justifyContent="center">
                    {allImages.map((img, i) => (
                         <Grid key={i} size={{ xs: 12, md: 8 }} sx={{ position: 'relative', height: { xs: '300px', md: '600px' }, mb: 2 }}>
                             <Image 
                                src={img} 
                                alt={`Gallery ${i}`} 
                                fill 
                                style={{ objectFit: 'contain' }} 
                             />
                         </Grid>
                    ))}
                 </Grid>
            </Box>
        </Box>
      </Dialog>
    </>
  );
}