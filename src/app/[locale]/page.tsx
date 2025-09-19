// /src/app/[locale]/page.tsx

import dynamic from 'next/dynamic'
import LazyLoadSection from "@/components/custom/LazyLoadSection"; // <-- 1. Import our new lazy load component
// --- EDIT 2: Import the props type ---
import type { AnimatedSectionProps } from '@/themes/default/custom/AnimatedSection';
import { Metadata } from "next";
import { getStaticPageMetadata } from "@/config/static-metadata";
import { generateStaticPageMetadata } from "@/lib/metadata";
// --- DYNAMIC THEME IMPORTS ---
const theme = process.env.NEXT_PUBLIC_THEME || 'default';

const HeroSection = dynamic(() => import(`@/themes/${theme}/sections/HeroSection`));
const FeaturedExperiences = dynamic(() => import(`@/themes/${theme}/sections/FeaturedExperiences`));
const WhyChooseUs = dynamic(() => import(`@/themes/${theme}/sections/WhyChooseUs`));
const BlogHighlightsSection = dynamic(() => import(`@/themes/${theme}/sections/BlogHighlightsSection`));
const SocialProofSection = dynamic(() => import(`@/themes/${theme}/sections/SocialProofSection`));
const TestimonialsSection = dynamic(() => import(`@/themes/${theme}/sections/TestimonialsSection`));
const NewsletterSection = dynamic(() => import(`@/themes/${theme}/sections/NewsletterSection`));
// const Header = dynamic(() => import(`@/themes/${theme}/ui/Header`));
// The AnimatedSection is part of the theme, so it's loaded dynamically too
// const AnimatedSection = dynamic(() => import(`@/themes/${theme}/custom/AnimatedSection`));
// --- EDIT 3: Apply the type to your dynamic component ---
const AnimatedSection = dynamic<AnimatedSectionProps>(() =>
  import(`@/themes/${theme}/custom/AnimatedSection`).then((mod) => mod.default)
);

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
  //  const HEADER_HEIGHT = 90; // Define your header height in pixels

  return (
    <>
      {/* <Header /> */}
      <main>
        {/* <Header/> */}
        <HeroSection />
        
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
    </>
  );
}
