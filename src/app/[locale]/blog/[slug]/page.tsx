// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/blog/[slug]/page.tsx
// -------------------------------------------------------------------------
import { Box } from "@mui/material";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getArticleBySlug } from "@/lib/data";
import { generateDynamicPageMetadata } from "@/lib/metadata";
import { Article } from "@/types/article";
import dynamic from "next/dynamic";
import { siteConfig } from '@/config/client-data';

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

// 1. Import our new server-side loader
import { getComponentImport } from "@/lib/theme-component-loader"; 

// 2. Import the props type
import type { PostLayoutProps } from '@/themes/default/blog/PostLayout';

// 3. REMOVE the old 'theme' variable
// const theme = process.env.NEXT_PUBLIC_THEME || 'default'; // <-- REMOVED

// 4. Use getComponentImport to load the component
// NOTICE: We are using the 'blog' subfolder now
const PostLayout = dynamic<PostLayoutProps>(
  getComponentImport('PostLayout', 'blog')
);

// --- ▲▲▲ CHANGES END HERE ▲▲▲ ---


// --- DYNAMIC SEO METADATA FUNCTION ---
type metaParams = Promise<{ slug: string, locale: string }>;

export async function generateMetadata({ params }: { params: metaParams }): Promise<Metadata> {
  const { slug, locale } = await params;

  if (!siteConfig.hasBlogSystem) {
    return {
      title: 'Not Found',
      description: 'The blog feature is currently disabled.',
    };
  }

  const article = (await getArticleBySlug(slug)) as Article | null;
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  // Use the fetched data to generate the metadata.
  return generateDynamicPageMetadata({
    title: article.title,
    description: article.translations?.[locale]?.content.substring(0, 160) + '...' || article.translations?.fr?.content.substring(0, 160) + '...' ,
    images: [{ src: article.coverImage, alt: article.title }],
    pathname: `/blog/${slug}`,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}

type Params = Promise<{ slug: string, locale: string }>;
export default async function ArticlePage({ params }: { params: Params }) {
  if (!siteConfig.hasBlogSystem) {
    notFound(); 
  }

  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }
  
  const translation = article.translations?.[locale] || article.translations?.en;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip', // Consider changing to 'BlogPosting' or 'Article' for blog posts
    name: translation?.title,
    description: translation?.description?.substring(0, 5000), 
    image: article.coverImage,
    offers: {
      '@type': 'Offer',
      price: '0', 
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    }
  };
  

  return (
    <section> 
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <PostLayout article={article} translation={translation} />
      </Box>
    </section>
  );
}