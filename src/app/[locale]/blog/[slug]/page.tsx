// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/blog/[slug]/page.tsx
// This page is now updated to render Markdown content.
// -------------------------------------------------------------------------
import { Box} from "@mui/material";
// import Header from "@/components/ui/Header";
// import Footer from "@/components/ui/Footer";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getArticleBySlug } from "@/lib/data";
import { generateDynamicPageMetadata } from "@/lib/metadata";
import { Article } from "@/types/article";
import dynamic from "next/dynamic";
import type { PostLayoutProps } from '@/themes/default/blog/PostLayout'; // Import the type



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
// --- DYNAMICALLY IMPORT THE CORRECT LAYOUT COMPONENT ---
const theme = process.env.NEXT_PUBLIC_THEME || 'default';

const PostLayout = dynamic<PostLayoutProps>(() => 
    import(`@/themes/${theme}/blog/PostLayout`)
);



type Params = Promise<{ slug: string, locale: string }>;
export default async function ArticlePage({ params }: { params: Params }) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }
  
  const translation = article.translations?.[locale] || article.translations?.en;
  /* const formattedDate = new Date(article.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }); */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: translation?.title,
    description: translation?.description?.substring(0, 5000), // Max length for description
    image: article.coverImage,
    offers: {
      '@type': 'Offer',
      price: '0', // Assuming no price for articles
      priceCurrency: 'MAD',
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
      {/* <Header /> */}
      <PostLayout article={article} translation={translation} />
      {/* <Footer /> */}
    </Box>
    </section>
  );
}
