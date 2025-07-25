// /src/app/about/page.tsx
//import Header from "@/components/ui/Header";
//import Footer from "@/components/ui/Footer";
import AboutSection from "@/components/sections/AboutSection";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";

// --- 2. This is the new, cleaner metadata function ---
type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  // We simply call our helper with the page key and the current locale.
  const { locale } = await params;
  const metadata = getStaticPageMetadata('about', locale);
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_UR || "https://upmerce.com", // Ensure you have this environment variable set
  });
}
  
export default function AboutPage() {
  return (
    // BEFORE: <Box className="flex flex-col min-h-screen bg-black">
    // AFTER:
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default' // <-- Uses the theme's background color
    }}>
      {/* <Header /> */}
      <main className="flex-grow">
        <AboutSection />
      </main>
      {/* <Footer /> */}
    </Box>
  );
}