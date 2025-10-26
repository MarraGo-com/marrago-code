// /src/app/[locale]/blog/page.tsx (UPDATED)

import { Grid, Box, Typography, Container } from "@mui/material";
import ArticleCard from "@/components/blog/ArticleCard";
import { getTranslations, getLocale } from "next-intl/server"; 
import { Metadata } from "next";
import { Article } from "@/types/article";
import { getPublishedArticles } from "@/lib/data";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";
import { siteConfig } from '@/config/client-data';
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

// 1. Import our new server-side loader
import { getComponentImport } from "@/lib/theme-component-loader"; 

// 2. Import the props type (path remains the same, as types don't affect runtime)
import { ResponsiveHeadingProps } from "@/themes/default/custom/ResponsiveHeading";

// 3. REMOVE the old 'theme' variable
// const theme = process.env.NEXT_PUBLIC_THEME || 'default'; // <-- REMOVED

// 4. Use getComponentImport to load the component
const ResponsiveHeading = dynamic<ResponsiveHeadingProps>(() =>
  getComponentImport('ResponsiveHeading', 'custom')().then((mod) => mod.default)
);

// --- ▲▲▲ CHANGES END HERE ▲▲▲ ---


type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  const { locale } = await params;

  if (!siteConfig.hasBlogSystem) {
    return generateStaticPageMetadata({
      title: "Page Not Found",
      description: "This page is not available.",
      pathname: `/blog`,
      url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
      images: [],
    });
  }

  const metadata = getStaticPageMetadata('blog', locale);
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}
  
export default async function BlogPage() {
  if (!siteConfig.hasBlogSystem) {
    redirect('/'); 
  }

  const articles = await getPublishedArticles();
  const t = await getTranslations('BlogPage'); 

  const locale = (await getLocale()) as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.blogPage || siteConfig.textContent.en.blogPage;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <main className="flex-grow">
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <ResponsiveHeading component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              {content.title}
            </ResponsiveHeading>
            <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              {content.subtitle}
            </Typography>
          </Box>

          {articles.length > 0 ? (
            <Grid container spacing={4}>
              {articles.map((article: Article) => (
                <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
    </Box>
  );
}