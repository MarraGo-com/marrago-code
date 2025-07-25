// src/app/page.tsx
// import Header from "@/components/ui/Header";
// import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedExperiences from "@/components/sections/FeaturedExperiences";
import WhyChooseUs from "@/components/sections/WhyChooseUs"; // <-- IMPORT HERE
import BlogHighlightsSection from "@/components/sections/BlogHighlightsSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { Metadata } from "next";
import { generateStaticPageMetadata } from "@/lib/metadata";
import { getStaticPageMetadata } from "@/config/static-metadata";
import AnimatedSection from "@/components/custom/AnimatedSection";



// --- 2. This is the new, cleaner metadata function ---
type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  // We simply call our helper with the page key and the current locale.
  const { locale } = await params;
  const metadata = getStaticPageMetadata('homepage', locale);
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com", // Ensure you have this environment variable set

  });
}
  

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
     <main className="flex-grow">
        {/* The HeroSection doesn't need animation as it's visible on page load */}
        <HeroSection />

        {/* --- 2. Wrap each subsequent section with the AnimatedSection component --- */}
        {/* We add a small, incremental delay to each one for a staggered effect. */}
        
        <AnimatedSection delay={0.2}>
          <SocialProofSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <FeaturedExperiences />
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <WhyChooseUs />
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <TestimonialsSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <BlogHighlightsSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <NewsletterSection />
        </AnimatedSection>

      </main>
      {/* <Footer /> */}
    </div>
  );
}