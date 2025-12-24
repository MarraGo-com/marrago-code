// /src/app/[locale]/page.tsx

import dynamic from 'next/dynamic';
import { siteConfig } from '@/config/client-data'; 
import { getComponentImport } from '@/lib/theme-component-loader'; 

import LazyLoadSection from "@/components/custom/LazyLoadSection";
import type { AnimatedSectionProps } from '@/themes/default/custom/AnimatedSection';
import { Metadata } from "next";
import { getStaticPageMetadata } from "@/config/static-metadata"; 
import { generateStaticPageMetadata } from "@/lib/metadata";

// 🟢 1. NEW IMPORTS
import { getPublishedArticles } from "@/lib/data"; // To fetch real data
import HomeInspiration from "@/components/home/HomeInspiration"; // Your new Luxury Component

// --- DYNAMIC THEME IMPORTS ---
const HeroSection = dynamic(getComponentImport('HeroSection'));
const FeaturedExperiences = dynamic(getComponentImport('FeaturedExperiences'));
const WhyChooseUs = dynamic(getComponentImport('WhyChooseUs'));
const SocialProofSection = dynamic(getComponentImport('SocialProofSection'));
const TestimonialsSection = dynamic(getComponentImport('TestimonialsSection'));
const NewsletterSection = dynamic(getComponentImport('NewsletterSection'));

// Note: We removed BlogHighlightsSection because we are replacing it with HomeInspiration

const AnimatedSection = dynamic<AnimatedSectionProps>(() =>
  getComponentImport('AnimatedSection', 'custom')().then((mod) => mod.default)
);

// --- METADATA FUNCTION ---
type MetadataParams = Promise< { locale: 'en' | 'fr' } >;

export async function generateMetadata({
  params,
}: {
  params: MetadataParams
}): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com";
  const { locale } = await params; 
  const metadata = getStaticPageMetadata('homepage', locale);

  return generateStaticPageMetadata({
    title: metadata.title,
    description: metadata.description,
    images: [metadata.ogImage],
    pathname: metadata.pathname,
    url: url,
  });
}

// --- HOME COMPONENT ---
// 🟢 2. Made Async to support Data Fetching
export default async function Home() {
  
  // 🟢 3. Fetch Real Articles (Server Side)
  // This ensures your Homepage loads instantly with SEO-ready content
  const articles = await getPublishedArticles();

  return (
    <>
      <main>
        <HeroSection />

        <LazyLoadSection>
            <AnimatedSection delay={0.2}>
                <SocialProofSection />
            </AnimatedSection>
        </LazyLoadSection>

        {siteConfig.hasExperiencesSection && (
          <LazyLoadSection>
            <AnimatedSection delay={0.3}>
              <FeaturedExperiences />
            </AnimatedSection>
          </LazyLoadSection>
        )}

        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <WhyChooseUs />
          </AnimatedSection>
        </LazyLoadSection>

        {siteConfig.hasReviewsSystem && (
          <LazyLoadSection>
            <AnimatedSection delay={0.3}>
              <TestimonialsSection />
            </AnimatedSection>
          </LazyLoadSection>
        )}

        {/* 🟢 4. NEW LUXURY JOURNAL SECTION */}
        {siteConfig.hasBlogSystem && articles.length > 0 && (
          <LazyLoadSection>
            <AnimatedSection delay={0.3}>
              {/* Replacing the old generic section with your new "Agadir Edit" */}
              <HomeInspiration articles={articles} />
            </AnimatedSection>
          </LazyLoadSection>
        )}

        <LazyLoadSection>
          <AnimatedSection delay={0.3}>
            <NewsletterSection />
          </AnimatedSection>
        </LazyLoadSection>

      </main>
    </>
  );
}