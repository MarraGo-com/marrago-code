// /src/app/[locale]/page.tsx

import dynamic from 'next/dynamic';
import { siteConfig } from '@/config/client-data'; // Your config import
import { getComponentImport } from '@/lib/theme-component-loader'; // <-- ADD THIS

import LazyLoadSection from "@/components/custom/LazyLoadSection";
import type { AnimatedSectionProps } from '@/themes/default/custom/AnimatedSection';
import { Metadata } from "next";
import { getStaticPageMetadata } from "@/config/static-metadata"; 
import { generateStaticPageMetadata } from "@/lib/metadata";

// --- [SERVER-SIDE] HELPER FUNCTION ---
// All logic is now in @/lib/theme.ts
// (The old function block is removed)

// --- DYNAMIC THEME IMPORTS ---
// These lines remain IDENTICAL, but now use the imported function
const HeroSection = dynamic(getComponentImport('HeroSection'));
const FeaturedExperiences = dynamic(getComponentImport('FeaturedExperiences'));
const WhyChooseUs = dynamic(getComponentImport('WhyChooseUs'));
const BlogHighlightsSection = dynamic(getComponentImport('BlogHighlightsSection'));
const SocialProofSection = dynamic(getComponentImport('SocialProofSection'));
const TestimonialsSection = dynamic(getComponentImport('TestimonialsSection'));
const NewsletterSection = dynamic(getComponentImport('NewsletterSection'));

const AnimatedSection = dynamic<AnimatedSectionProps>(() =>
  getComponentImport('AnimatedSection', 'custom')().then((mod) => mod.default)
);

// --- METADATA FUNCTION ---
// (This remains unchanged)
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
// (This remains unchanged)
export default function Home() {
  return (
    <>
      <main>
        <HeroSection />

        {
          <LazyLoadSection>
            <AnimatedSection delay={0.2}>
              <SocialProofSection />
            </AnimatedSection>
          </LazyLoadSection>
        }

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

        {siteConfig.hasBlogSystem && (
          <LazyLoadSection>
            <AnimatedSection delay={0.3}>
              <BlogHighlightsSection />
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