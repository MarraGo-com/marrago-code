// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/sections/BlogHighlightsSection.tsx
// This is a new Server Component that fetches and displays the latest articles.
// -------------------------------------------------------------------------
import {Grid, Box, Typography, Container } from "@mui/material";
import ArticleCard from "@/components/blog/ArticleCard";
import { adminDb } from "@/lib/firebase-admin";
import { getTranslations } from "next-intl/server";
import MainHeading from "../custom/MainHeading";
import { Article } from "@/types/article";

// This server-side function fetches the 3 most recent published articles.
async function getLatestArticles() {
  try {
    const articlesSnapshot = await adminDb
      .collection('articles')
      .where('status', '==', 'published')
      .orderBy('createdAt', 'desc')
      .limit(3) // We only want the latest 3 articles
      .get();
    
    const articles = articlesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug,
        coverImage: data.coverImage,
        createdAt: data.createdAt.toDate().toISOString(),
        translations: data.translations,
        // Add required fields with fallback/defaults
        title: data.translations?.en?.title || 'No Title',
        status: data.status || 'published',
      };
    });

    return articles;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export default async function BlogHighlightsSection() {
  const articles = await getLatestArticles();
  const t = await getTranslations('BlogHighlights');


  // If there are no articles, we don't render this section at all.
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeading 
            titleKey='title' 
            variant="h2"
            component="h2"
            t={t}  
            sx={{ fontWeight: 'bold', mb: 2 }}
          />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {articles.map((article: Article) => {
            // We pass the full article object to the card.
            // The ArticleCard component already knows how to handle translations.
            return (
              <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ArticleCard article={article} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
