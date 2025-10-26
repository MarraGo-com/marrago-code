// /src/app/about/page.tsx
//import Header from "@/components/ui/Header";
//import Footer from "@/components/ui/Footer";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

// 1. Import our server-side loader
import { getComponentImport } from "@/lib/theme-component-loader";

// 2. REMOVE the old 'theme' variable
// const theme = process.env.NEXT_PUBLIC_THEME || 'default'; // <-- REMOVED

// 3. Use getComponentImport to load the component
// The default subfolder is 'sections', so this works perfectly.
const AboutSection = dynamic(getComponentImport('AboutSection', 'sections'));

// --- ▲▲▲ CHANGES END HERE ▲▲▲ ---


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
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}
  
export default function AboutPage() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* <Header /> */}
      <main className="flex-grow">
        <AboutSection />
      </main>
      {/* <Footer /> */}
    </Box>
  );
}