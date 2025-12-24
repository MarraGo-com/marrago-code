// src/app/[locale]/blog/[slug]/page.tsx

import { Box } from "@mui/material";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getArticleBySlug } from "@/lib/data";
import { generateDynamicPageMetadata } from "@/lib/metadata";
import { Article } from "@/types/article";
import dynamic from "next/dynamic";
import { siteConfig } from '@/config/client-data';
import { getComponentImport } from "@/lib/theme-component-loader"; 

// Import the props type
import type { PostLayoutProps } from '@/themes/default/blog/PostLayout';

// Load the component dynamically
const PostLayout = dynamic<PostLayoutProps>(
  getComponentImport('PostLayout', 'blog')
);

// --- 1. HELPER FUNCTION: Extracts plain text from TipTap JSON ---
const extractTextFromTipTap = (contentJson: any, limit: number = 160): string => {
  if (!contentJson) return '';

  // Handle Legacy String Data (Just in case)
  if (typeof contentJson === 'string') {
      return contentJson.substring(0, limit) + (contentJson.length > limit ? '...' : '');
  }

  // Handle TipTap JSON Object
  let text = '';
  if (contentJson.content && Array.isArray(contentJson.content)) {
    for (const block of contentJson.content) {
      if (block.content && Array.isArray(block.content)) {
        for (const span of block.content) {
          if (span.type === 'text' && span.text) {
            text += span.text + ' ';
          }
        }
      }
      if (text.length >= limit) break;
    }
  }
  
  return text.trim().substring(0, limit) + (text.length > limit ? '...' : '');
};

type metaParams = Promise<{ slug: string, locale: string }>;

export async function generateMetadata({ params }: { params: metaParams }): Promise<Metadata> {
  const { slug, locale } = await params;

  if (!siteConfig.hasBlogSystem) {
    return { title: 'Not Found', description: 'Blog disabled.' };
  }

  const article = (await getArticleBySlug(slug)) as Article | null;
  
  if (!article) {
    return { title: 'Article Not Found', description: 'Article not found.' };
  }

  const translation = article.translations?.[locale] || article.translations?.['en'];
  
  // Use Helper to get clean description
  const descriptionText = extractTextFromTipTap(translation?.content, 160);

  return generateDynamicPageMetadata({
    title: translation?.title || article.title,
    description: descriptionText,
    images: [{ src: article.coverImage, alt: translation?.title || article.title }],
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
  
  // Extract longer text for Schema SEO
  const descriptionText = extractTextFromTipTap(translation?.content, 500);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translation?.title,
    description: descriptionText,
    image: article.coverImage,
    author: {
        '@type': 'Person',
        name: article.author || 'Editorial Team'
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
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