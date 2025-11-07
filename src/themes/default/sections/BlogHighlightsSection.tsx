// /src/components/sections/BlogHighlightsSection.tsx (UPDATED)

import { Grid, Box, Typography, Container } from "@mui/material";
import ArticleCard from "@/components/blog/ArticleCard";
import { adminDb } from "@/lib/firebase-admin";
// REMOVED: getTranslations is no longer needed for this section's text
// import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server"; // NEW: For getting locale in Server Components

// NEW: Import client data

// UPDATED: Use MainHeadingUserContent for direct title prop
import { Article } from "@/types/article";
import MainHeadingUserContent from "@/components/custom/MainHeadingUserContent";
import { siteConfig } from "@/config/client-data";

// This server-side function remains the same
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
        author: data.author || siteConfig.ownerName || siteConfig.siteName,      };
    });

    return articles;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export default async function BlogHighlightsSection() {
  const articles = await getLatestArticles();
  // REMOVED: const t = await getTranslations('BlogHighlights');
  
  // NEW: Get locale and content from the client data file
  const locale = (await getLocale()) as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  // If there are no articles, we don't render this section at all.
  if (!articles || articles.length === 0) {
    return null;
  }

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

        <Grid container spacing={4}>
          {articles.map((article: Article) => {
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