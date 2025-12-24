'use client';

import React from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl'; // 🟢 Added useTranslations
import { Article } from '@/types/article';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { AccessTime, ArrowForward, LocalOffer } from '@mui/icons-material';

export interface ArticleCardProps {
  article: Article;
  isFeatured?: boolean;
  variant?: 'standard' | 'commercial' | 'hero';
}

export default function ArticleCard({ article, isFeatured, variant = 'standard' }: ArticleCardProps) {
  const locale = useLocale();
  const t = useTranslations('BlogPage.card'); // 🟢 Hook for translations
  const tAd = useTranslations('BlogPage.ad');

  const translation = article.translations?.[locale as 'en'|'fr'|'es'] || article.translations?.en || { title: 'Untitled' };
  
  const formattedDate = article.createdAt 
    ? format(new Date(article.createdAt), 'MMM d, yyyy') 
    : '';

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
          height: isHero ? { xs: 400, md: '100%' } : 450, 
          width: '100%',
          borderRadius: 4, 
          overflow: 'hidden',
          cursor: 'pointer',
          bgcolor: isCommercial ? '#C15836' : 'background.paper', 
          boxShadow: 3,
        }}
      >
        {/* BACKGROUNDS (Unchanged) */}
        {!isCommercial && (
            <Box
                component={motion.div}
                variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${article.coverImage || '/images/placeholder.jpg'})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                }}
            />
        )}
        
        {isCommercial && (
             <Box sx={{ position: 'absolute', inset: 0, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 <Typography variant="h1" sx={{ opacity: 0.1, fontWeight: 900, fontSize: '10rem', position: 'absolute', rotate: '-15deg', color: 'white' }}>GO</Typography>
             </Box>
        )}

        {!isCommercial && (
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)', zIndex: 1 }} />
        )}

        {/* LABELS */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <Chip 
                // 🟢 TRANSLATED LABEL
                label={isCommercial ? t('promoted') : t('guide')} 
                size="small"
                sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', 
                    color: 'white', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' 
                }} 
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {isCommercial ? <LocalOffer fontSize="small" /> : <AccessTime fontSize="small" />}
                <Typography variant="caption" fontWeight="medium">
                    {/* 🟢 TRANSLATED DATE/BOOKING */}
                    {isCommercial ? t('instantBook') : formattedDate}
                </Typography>
            </Box>
        </Box>

        {/* CONTENT */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography 
                component={motion.h3}
                variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                transition={{ duration: 0.3 }}
                variant={isHero ? "h3" : "h5"} 
                sx={{ color: 'white', lineHeight: 1.1, fontWeight: isHero ? 800 : 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
                {translation.title}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography 
                    variant="button" component={motion.span}
                    variants={{ rest: { opacity: 0, x: -10 }, hover: { opacity: 1, x: 0 } }}
                    sx={{ color: '#ff9800', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'none' }}
                >
                    {/* 🟢 TRANSLATED CTA */}
                    {isCommercial ? tAd('button') : t('readStory')} <ArrowForward fontSize="inherit" />
                </Typography>

                <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 300 }}>
                    {isCommercial ? tAd('price') : `By ${article.author || 'Team'}`}
                </Typography>
            </Box>
        </Box>
      </Box>
    </Link>
  );
}