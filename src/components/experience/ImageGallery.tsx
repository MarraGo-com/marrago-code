// /src/components/experience/ImageGallery.tsx
'use client';

import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import Image from 'next/image'; // <-- Import the Next.js Image component
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { GalleryImage } from '@/types/experience';

// Interface definitions

interface ImageGalleryProps {
  coverImage: string;
  galleryImages?: GalleryImage[];
  altText: string;
}

export default function ImageGallery({ coverImage, galleryImages = [], altText }: ImageGalleryProps) {
  // This logic correctly filters out hidden images and includes the cover image first.
  const visibleImages = [
    { path: coverImage, hidden: false }, 
    ...galleryImages.filter(img => !img.hidden) 
  ];

  // If there's only one image, we display it statically without the carousel.
  if (visibleImages.length <= 1) {
    return (
      <Box sx={{ position: 'relative', width: '100%', height: {xs: 300, sm: 400, md: 500}, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Image
          src={coverImage}
          alt={altText}
          fill
          style={{ objectFit: 'cover' }}
          priority // Correctly prioritize this LCP image
          fetchPriority='high'
          // --- THIS IS THE KEY FIX ---
          // This is a more accurate sizes prop for this specific layout.
          sizes="(max-width: 900px) 100vw, 58vw"
        />
      </Box>
    );
  }

  const settings = {
    customPaging: function(i: number) {
      return (
        <a>
          {/* --- FIX 1: Use Next/Image for thumbnails --- */}
          <Box sx={{ position: 'relative', width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
            <Image 
              src={visibleImages[i].path} 
              alt={`thumbnail ${i + 1}`}
              fill
              loading="lazy"
              style={{ objectFit: 'cover' }}
              sizes="80px"
            />
          </Box>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true, 
    responsive: [
      {
        breakpoint: 600,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <Box className="image-gallery" sx={{ 
      mb: 10, // Increased margin to prevent thumbnail overlap
      '.slick-dots': {
        position: 'relative',
        bottom: 'auto',
        marginTop: 2,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: '8px 0',
        '::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      },
      '.slick-thumb li': { 
        width: '80px', 
        height: '60px', 
        cursor: 'pointer',
        margin: '0 4px',
      },
      '.slick-prev, .slick-next': {
        zIndex: 1,
        '&:before': {
          fontSize: '24px',
          color: 'white',
          textShadow: '0 0 8px rgba(0,0,0,0.7)'
        }
      },
      '.slick-prev': { left: 15 },
      '.slick-next': { right: 15 },
    }}>
      <Slider {...settings}>
        {visibleImages.map((img, index) => (
          <div key={index}>
            <Box sx={{ position: 'relative', width: '100%', height: {xs: 300, sm: 400, md: 500}, borderRadius: 2, overflow: 'hidden' }}>
              <Image
                src={img.path} 
                alt={`${altText} - view ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 58vw"
                // --- THIS IS THE KEY FIX ---
                // Only the first image is prioritized. The rest are lazy-loaded.
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'low'}
                loading={index === 0 ? undefined : "lazy"}
              />
            </Box>
          </div>
        ))}
      </Slider>
    </Box>
  );
}
