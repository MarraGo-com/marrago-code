'use client';

import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Button, Chip, Tab, Tabs, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircleOutline } from '@mui/icons-material';
import ArticleCard from '@/components/blog/ArticleCard'; 
import { Article } from '@/types/article';
import { useLocale, useTranslations } from 'next-intl';

// 🟢 SMART CLASSIFIER (Since DB lacks categories)
const detectCategory = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('food') || t.includes('cook') || t.includes('tea') || t.includes('manger')) return 'food';
  if (t.includes('surf') || t.includes('quad') || t.includes('hike') || t.includes('trek') || t.includes('balloon')) return 'adventure';
  if (t.includes('souk') || t.includes('history') || t.includes('culture') || t.includes('medina')) return 'culture';
  return 'relaxation'; // Default fallback
};

export default function BlogFeed({ articles }: { articles: Article[] }) {
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  const t = useTranslations('BlogPage'); // 🟢 LOAD TRANSLATIONS
  const theme = useTheme();

  // 🟢 TRANSLATED FILTER KEYS
  const FILTERS = [
    { key: 'all', label: t('filters.all') },
    { key: 'adventure', label: t('filters.adventure') },
    { key: 'food', label: t('filters.food') },
    { key: 'culture', label: t('filters.culture') },
  ];

  const [activeFilterKey, setActiveFilterKey] = useState('all');

  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  // 🟢 REAL FILTERING LOGIC
  const getDisplayItems = () => {
    let filtered = remainingArticles;

    if (activeFilterKey !== 'all') {
      filtered = remainingArticles.filter(article => {
        // Get title in current language
        const title = article.translations?.[locale]?.title || article.translations?.en?.title || '';
        // Check if detected category matches selected filter
        return detectCategory(title) === activeFilterKey;
      });
    }

    // Insert Ad Logic (Same as before)
    const adArticle = {
        id: 'ad-commercial-1',
        slug: 'paradise-valley-booking', 
        coverImage: '', 
        createdAt: new Date().toISOString(),
        author: 'MarraGo',
        translations: {
            [locale]: { title: t('ad.title'), content: {} }
        }
    } as unknown as Article; 

    // Insert AD only if list is long enough
    const items = [...filtered];
    if (items.length >= 2) {
        items.splice(2, 0, adArticle);
    }
    return items;
  };

  const displayItems = getDisplayItems();
  const heroTranslation = heroArticle?.translations[locale] || heroArticle?.translations.en;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      
      {/* HERO SECTION */}
      {heroArticle && (
        <Box sx={{ height: { xs: 'auto', md: '75vh' }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 4 }}>
            <Box sx={{ flex: 1.2, position: 'relative', bgcolor: '#000', overflow: 'hidden', minHeight: '400px' }}>
                <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} src="/videos/hero-video.mp4" />
                <Box sx={{ position: 'absolute', bottom: { xs: 20, md: 40 }, left: { xs: 20, md: 40 }, right: 40, zIndex: 2 }}>
                    <Typography variant="overline" color="white" sx={{ letterSpacing: 3, mb: 1, display: 'block', opacity: 0.9 }}>
                        {t('journalLabel')}
                    </Typography>
                    <Typography variant="h2" color="white" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                        {t('heroTitle')}
                    </Typography>
                    <Button variant="outlined" color="inherit" startIcon={<PlayCircleOutline />} sx={{ borderColor: 'white', color: 'white', borderRadius: 20, px: 3, backdropFilter: 'blur(4px)' }}>
                        {t('watchFilm')}
                    </Button>
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 1 }} />
            </Box>

            <Box sx={{ flex: 0.8, bgcolor: 'background.paper', color: 'text.primary', p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid', borderColor: 'divider' }}>
                <Chip label={t('editorsPick')} color="primary" sx={{ alignSelf: 'start', mb: 3, fontWeight: 'bold' }} />
                <Typography variant="h3" component="h1" sx={{ fontFamily: '"Playfair Display", serif', mb: 3, fontWeight: 700 }}>
                    {heroTranslation?.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                    {t('heroSubtitle')}
                </Typography>
                <ArticleCard article={heroArticle} variant="hero" isFeatured={true} />
            </Box>
        </Box>
      )}

      {/* FILTER BAR */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: alpha(theme.palette.background.paper, 0.85), backdropFilter: 'blur(12px)', borderBottom: 1, borderColor: 'divider', py: 2 }}>
         <Container maxWidth="xl">
            <Tabs 
                value={activeFilterKey} 
                onChange={(e, v) => setActiveFilterKey(v)}
                variant="scrollable" scrollButtons="auto"
                sx={{ 
                    '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', fontWeight: 600, minHeight: 40, borderRadius: 4, mr: 1, color: 'text.secondary', '&.Mui-selected': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) } },
                    '& .MuiTabs-indicator': { display: 'none' } 
                }}
            >
                {FILTERS.map((f) => <Tab key={f.key} label={f.label} value={f.key} />)}
            </Tabs>
         </Container>
      </Box>

      {/* GRID */}
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
            <AnimatePresence mode="popLayout">
                {displayItems.map((item) => {
                    
                    const isAd = item.id === 'ad-commercial-1';
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id} component={motion.div} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                            <ArticleCard article={item} variant={isAd ? 'commercial' : 'standard'} />
                        </Grid>
                    );
                })}
                {displayItems.length === 0 && (
                  <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">No stories found for this category yet.</Typography>
                  </Box>
                )}
            </AnimatePresence>
        </Grid>
      </Container>
    </Box>
  );
}