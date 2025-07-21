// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/blog/[slug]/page.tsx
// This page is now updated to render Markdown content.
// -------------------------------------------------------------------------
import { Box, Typography, Container } from "@mui/material";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; // <-- 1. IMPORT THE MARKDOWN COMPONENT
import remarkGfm from 'remark-gfm'; // <-- 2. IMPORT THE GFM PLUGIN
import { getArticleBySlug } from "@/lib/data";
import { generateDynamicPageMetadata } from "@/lib/metadata";
import { Article } from "@/types/article";
import Image from "next/image";

// This function fetches the data for a single article
/* async function getArticle(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) {
      return null; // Return null if article not found (404)
    }
    const data = await res.json();
    return data.article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
} */

// --- DYNAMIC SEO METADATA FUNCTION ---
type metaParams = Promise<{ slug: string, locale: string }>;

export async function generateMetadata({ params }: { params: metaParams }): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = (await getArticleBySlug(slug)) as Article | null;
  
  if (!article) {
    return {
      title: 'Article Not Found'
    };
  }

 

 // Use the fetched data to generate the metadata.
  return generateDynamicPageMetadata({
    title: article.title,
    description: article.translations?.[locale]?.content.substring(0, 160) + '...' || article.translations?.fr?.content.substring(0, 160) + '...' ,
    images: [{ src: article.coverImage, alt: article.title }],
    pathname: `/blog/${slug}`,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com", // Ensure you have this environment variable set

  });
}

type Params = Promise<{ slug: string, locale: string }>;
export default async function ArticlePage({ params }: { params: Params }) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const translation = article.translations?.[locale] || article.translations?.en;
  const formattedDate = new Date(article.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <main className="flex-grow">
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
          <article>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {translation?.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Published on {formattedDate}
            </Typography>

            {/* --- 2. REPLACE THE <Box component="img"> WITH A WRAPPER AND <Image> --- */}
            <Box sx={{
              position: 'relative', // Required for the <Image> fill prop
              width: '100%',
              aspectRatio: '16/9', // Defines a consistent aspect ratio
              maxHeight: '500px',
              borderRadius: 2,
              overflow: 'hidden', // Ensures the image respects the border-radius
              mb: 4,
            }}>
              <Image
                src={article.coverImage}
                alt={translation?.title || article.title}
                fill // Makes the image fill the parent container
                style={{ objectFit: 'cover' }} // Ensures the image covers the area without distortion
                priority // Preload this image as it's the LCP (Largest Contentful Paint)
              />
            </Box>
            
            <Box sx={{
              lineHeight: 1.8,
              fontSize: '1.1rem',
              // ... other markdown styles
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {translation?.content}
              </ReactMarkdown>
            </Box>
          </article>
        </Container>
      </main>
      <Footer />
    </Box>
  );
}
