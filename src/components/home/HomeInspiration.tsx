'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import ArticleCard from '@/components/blog/ArticleCard';
import { ArrowForward } from '@mui/icons-material';
import { Article } from '@/types/article';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl'; // 🟢 Import

export default function HomeInspiration({ articles }: { articles: Article[] }) {
  const t = useTranslations('BlogPage'); // 🟢 Use translations

  if (!articles || articles.length < 3) return null;
  const [heroArticle, ...sideArticles] = articles.slice(0, 3);

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 6 }}>
            <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>
                    {t('journalLabel')}
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, mt: 1 }}>
                    {t('homeInspiration.title')}
                </Typography>
            </Box>
            <Button component={Link} href="/blog" endIcon={<ArrowForward />} sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 20, px: 3 }} variant="outlined" color="inherit">
                {t('homeInspiration.viewAll')}
            </Button>
        </Box>

        <Grid container spacing={4}>
            <Grid size= {{xs: 12, md: 8}}>
                <ArticleCard article={heroArticle} variant="hero" isFeatured={true} />
            </Grid>
            <Grid size= {{xs: 12, md: 4}} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {sideArticles.map((article: Article) => (
                    <Box key={article.id} sx={{ flex: 1 }}>
                        <ArticleCard article={article} variant="standard" />
                    </Box>
                ))}
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}