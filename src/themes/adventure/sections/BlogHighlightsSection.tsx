// /src/themes/adventure/sections/BlogHighlightsSection.tsx (UPDATED)

import { Grid, Box, Typography, Container } from "@mui/material";
// REMOVED: getTranslations is no longer needed
// import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server"; // NEW: For getting locale in Server Components

// NEW: Import client data

// UPDATED: Use MainHeadingUserContent for direct title prop
import MainHeadingUserContent from '../../../components/custom/MainHeadingUserContent';
import { Article } from "@/types/article";
import { adminDb } from "@/lib/firebase-admin";
import dynamic from 'next/dynamic';
import { ArticleCardProps } from "../blog/ArticleCard";
import { siteConfig } from "@/config/client-data";

// Data fetching function remains the same
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
        author: data.author || 'Upmerce Solutions',
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

// Dynamically import the adventure ArticleCard
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
const ArticleCard = dynamic<ArticleCardProps>(() => import(`@/themes/${theme}/blog/ArticleCard`));

export default async function BlogHighlightsSection() {
  const articles = (await getLatestArticles()) as Article[];
  // REMOVED: const t = await getTranslations('BlogHighlights');

  // NEW: Get locale and content from the client data file
  const locale = (await getLocale()) as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  if (!articles || articles.length === 0) {
    return null;
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 2); // Corrected to slice 1 article, assuming 2 secondary total. If you need 2, use slice(1, 3)

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          {/* UPDATED: Using MainHeadingUserContent with direct title from client data */}
          <MainHeadingUserContent
            title={content.blogHighlightsTitle}
            variant="h2"
            component="h2"
            sx={{ fontWeight: 'bold', mb: 2 }}
          />
          {/* UPDATED: Using subtitle from client data */}
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.blogHighlightsSubtitle}
          </Typography>
        </Box>
        
        {/* Main Featured Article */}
        <Box sx={{ mb: 6 }}>
          <ArticleCard article={mainArticle} isFeatured={true} />
        </Box>

        {/* Secondary Articles */}
        <Grid container spacing={4}>
          {secondaryArticles.map((article: Article) => (
            <Grid size={{xs: 12, md: 6}} key={article.id}>
              <ArticleCard article={article} isFeatured={false} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}