// /src/themes/luxury/sections/BlogHighlightsSection.tsx

import { Grid, Box, Typography, Container } from "@mui/material";
import { getTranslations } from "next-intl/server";
import MainHeading from '../../default/custom/MainHeading';
import { Article } from "@/types/article";
import { adminDb } from "@/lib/firebase-admin";
import dynamic from 'next/dynamic';
import { ArticleCardProps } from "../blog/ArticleCard";

// This is the same data fetching function from your default component
async function getLatestArticles() {
  try {
    const articlesSnapshot = await adminDb
      .collection('articles')
      .where('status', '==', 'published')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();
    
    const articles = articlesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug,
        coverImage: data.coverImage,
        createdAt: data.createdAt.toDate().toISOString(),
        translations: data.translations,
        title: data.translations?.en?.title || 'No Title',
        status: data.status || 'published',
        author: data.author || 'Upmerce Solutions',
      };
    });
    return articles;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

// Dynamically import the new luxury ArticleCard
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ArticleCard = dynamic<ArticleCardProps>(() => import(`@/themes/${theme}/blog/ArticleCard`));


export default async function BlogHighlightsSection() {
  const articles = (await getLatestArticles()) as Article[];
  const t = await getTranslations('BlogHighlights');

  if (!articles || articles.length === 0) {
    return null;
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeading 
            titleKey='title' 
            variant="h2"
            component="h2"
            t={t}  
            sx={{ 
            //  fontFamily: 'lora, serif',
              fontWeight: 500,
              mb: 2 
            }}
          />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        {/* --- THIS IS THE KEY CHANGE --- */}
        {/* An elegant, asymmetrical layout */}
        <Grid container spacing={5}>
          {/* Main Featured Article (takes up half the space) */}
          <Grid  size={{xs: 12, md: 7}}>
            <ArticleCard article={mainArticle} isFeatured={true} />
          </Grid>

          {/* Secondary Articles (stacked on the other half) */}
          <Grid size={{xs: 12, md: 5}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {secondaryArticles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} isFeatured={false} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}