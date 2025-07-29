// /src/app/[locale]/page.tsx
import HeroSection from "@/components/sections/HeroSection";
import FeaturedExperiences from "@/components/sections/FeaturedExperiences";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import BlogHighlightsSection from "@/components/sections/BlogHighlightsSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import AnimatedSection from "@/components/custom/AnimatedSection";
import LazyLoadSection from "@/components/custom/LazyLoadSection"; // <-- 1. Import our new lazy load component
import { Metadata } from "next";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";

type MetadataParams = Promise<{ locale: 'en' | 'fr' }>;

export async function generateMetadata({ 
  params,
}: { 
  params: MetadataParams 
}): Promise<Metadata> {
  // We simply call our helper with the page key and the current locale.
  const url = process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com"; // Ensure you have this environment variable set
  const { locale } = await params;
  const metadata = getStaticPageMetadata('homepage', locale);

 
  
  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: url, // Ensure you have this environment variable set
  });
 
}
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* The HeroSection is always visible first, so it does not need to be lazy-loaded. */}
        <HeroSection />

        {/* --- 2. Wrap all "below-the-fold" sections with both LazyLoadSection and AnimatedSection --- */}
        {/* The outer LazyLoadSection prevents rendering, the inner AnimatedSection handles the animation once rendered. */}
        
        <LazyLoadSection>
          <AnimatedSection delay={0.2}>
            <SocialProofSection />
          </AnimatedSection>
        </LazyLoadSection>
        
        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <FeaturedExperiences />
          </AnimatedSection>
        </LazyLoadSection>
        
        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <WhyChooseUs />
          </AnimatedSection>
        </LazyLoadSection>
        
        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <TestimonialsSection />
          </AnimatedSection>
        </LazyLoadSection>
        
        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <BlogHighlightsSection />
          </AnimatedSection>
        </LazyLoadSection>
        
        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <NewsletterSection />
          </AnimatedSection>
        </LazyLoadSection>

      </main>

    </div>
  );
}
