import { Box } from "@mui/material";
//import { getTranslations } from "next-intl/server"; 
import { Metadata } from "next";
import { getPublishedArticles } from "@/lib/data";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";
import { siteConfig } from '@/config/client-data';
import { redirect } from "next/navigation";
import BlogFeed from "@/components/blog/BlogFeed"; // 🟢 Import the new component

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

  // 1. Fetch Data (Server Side)
  const articles = await getPublishedArticles();

  // 2. Render Client Feed (Client Side)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <main className="flex-grow">
          {/* We pass the articles to the interactive feed */}
          <BlogFeed articles={articles} />
      </main>
    </Box>
  );
}