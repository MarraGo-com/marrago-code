// -------------------------------------------------------------------------
// 3. NEW FILE: /src/app/[locale]/blog/page.tsx
// This is the main public blog page that lists all published articles.
// -------------------------------------------------------------------------
import {Grid, Box, Typography, Container } from "@mui/material";

// import Header from "@/components/ui/Header";
// import Footer from "@/components/ui/Footer";
import ArticleCard from "@/components/blog/ArticleCard";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Article } from "@/types/article";
import { getPublishedArticles } from "@/lib/data";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";

import dynamic from "next/dynamic";
import { ResponsiveHeadingProps } from "@/themes/default/custom/ResponsiveHeading";
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
// const ResponsiveHeading = dynamic(() => import(`@/themes/${theme}/custom/ResponsiveHeading`));
const ResponsiveHeading = dynamic<ResponsiveHeadingProps>(() =>
  import(`@/themes/${theme}/custom/ResponsiveHeading`).then((mod) => mod.default)
);
// --- 2. This is the new, cleaner metadata function ---
type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  // We simply call our helper with the page key and the current locale.
  const { locale } = await params;
  const metadata = getStaticPageMetadata('blog', locale);
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com", // Ensure you have this environment variable set

  });
}
  

export default async function BlogPage() {
  const articles = await getPublishedArticles();
  const t = await getTranslations('BlogPage');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* <Header /> */}
      <main className="flex-grow">
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <ResponsiveHeading component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('title')}
            </ResponsiveHeading>
            <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              {t('subtitle')}
            </Typography>
          </Box>

          {articles.length > 0 ? (
            <Grid container spacing={4}>
              {articles.map((article: Article) => (
                <Grid key={article.id}  size={{ xs: 12, sm: 6, md: 4 }}>
                  <ArticleCard article={article} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', mt: 8 }}>
              {t('noArticles')}
            </Typography>
          )}
        </Container>
      </main>
      {/* <Footer /> */}
    </Box>
  );
}