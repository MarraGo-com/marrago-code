// /src/themes/adventure/blog/ArticleCard.tsx
'use client';

import React from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Article } from '@/types/article';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { AccessTime, ArrowForward, LocalOffer } from '@mui/icons-material';

export interface ArticleCardProps {
  article: Article;
  isFeatured?: boolean;
  variant?: 'standard' | 'commercial' | 'hero'; // 🟢 NEW: Added 'commercial' support
}

export default function ArticleCard({ article, isFeatured, variant = 'standard' }: ArticleCardProps) {
  const locale = useLocale();
  // Safe translation access with fallback
  const translation = article.translations?.[locale as 'en'|'fr'|'es'] || article.translations?.en || { title: 'Untitled' };
  
  const formattedDate = article.createdAt 
    ? format(new Date(article.createdAt), 'MMM d, yyyy') 
    : '';

  // 🟢 DETERMINE MODE: Is this a "Native Ad" (Commercial) card?
  // You can trigger this manually via props, or based on article tags/categories later
  const isCommercial = variant === 'commercial';
  const isHero = isFeatured || variant === 'hero';

  return (
    <Link href={isCommercial ? '/experiences' : `/blog/${article.slug}`} passHref style={{ textDecoration: 'none' }}>
      <Box
        component={motion.div}
        initial="rest"
        whileHover="hover"
        animate="rest"
        sx={{
          position: 'relative',
          height: isHero ? { xs: 400, md: '100%' } : 450, // Hero fills height on desktop
          width: '100%',
          borderRadius: 4, // More rounded luxury feel
          overflow: 'hidden',
          cursor: 'pointer',
          bgcolor: isCommercial ? '#C15836' : 'background.paper', // Commercial = Terracotta color
          boxShadow: 3,
        }}
      >
        {/* 1. BACKGROUND IMAGE (Standard Only) */}
        {!isCommercial && (
            <Box
                component={motion.div}
                variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.05 }
                }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${article.coverImage || '/images/placeholder.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        )}
        
        {/* 1b. COMMERCIAL BACKGROUND */}
        {isCommercial && (
             <Box sx={{ position: 'absolute', inset: 0, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 {/* Decorative background text */}
                 <Typography variant="h1" sx={{ opacity: 0.1, fontWeight: 900, fontSize: '10rem', position: 'absolute', rotate: '-15deg', color: 'white' }}>GO</Typography>
             </Box>
        )}

        {/* 2. OVERLAY (Standard Only) - Ensures text readability */}
        {!isCommercial && (
            <Box sx={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', 
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                zIndex: 1 
            }} />
        )}

        {/* 3. TOP LABELS */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <Chip 
                label={isCommercial ? "Promoted" : "Guide"} 
                size="small"
                sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.25)', 
                    backdropFilter: 'blur(10px)', 
                    color: 'white', fontWeight: 'bold', 
                    textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' 
                }} 
            />
            {/* Metadata (Date or "Instant Book") */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {isCommercial ? <LocalOffer fontSize="small" /> : <AccessTime fontSize="small" />}
                <Typography variant="caption" fontWeight="medium">
                    {isCommercial ? "Instant Book" : formattedDate}
                </Typography>
            </Box>
        </Box>

        {/* 4. CONTENT WRAPPER */}
        <Box sx={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, zIndex: 2,
            display: 'flex', flexDirection: 'column', gap: 1
        }}>
            {/* Title */}
            <Typography 
                component={motion.h3}
                variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                transition={{ duration: 0.3 }}
                variant={isHero ? "h3" : "h5"} 
                sx={{ 
                    color: 'white', 
                    lineHeight: 1.1, 
                    fontWeight: isHero ? 800 : 700,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
            >
                {translation.title}
            </Typography>

            {/* Footer Row (CTA + Subtext) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                
                {/* 🟢 ANIMATED CTA: "Read Story" slides in on hover */}
                <Typography 
                    variant="button" 
                    component={motion.span}
                    variants={{ rest: { opacity: 0, x: -10 }, hover: { opacity: 1, x: 0 } }}
                    sx={{ 
                        color: '#ff9800', // Bright Orange Accent
                        fontWeight: 'bold', 
                        display: 'flex', alignItems: 'center', gap: 1,
                        textTransform: 'none'
                    }}
                >
                    {isCommercial ? "Reserve Spot" : "Read Story"} <ArrowForward fontSize="inherit" />
                </Typography>

                {/* Author or Price */}
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 300 }}>
                    {isCommercial ? "From €35" : `By ${article.author || 'Team'}`}
                </Typography>
            </Box>
        </Box>
      </Box>
    </Link>
  );
}