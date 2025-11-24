// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/experiences/[id]/page.tsx
// -------------------------------------------------------------------------
import dynamic from "next/dynamic";
import { getExperienceById, getReviewSummary } from "@/lib/data";
import { Experience } from "@/types/experience";
import { Metadata } from "next";
import { generateDynamicPageMetadata } from "@/lib/metadata";
import { ExperienceDetailsProps } from "@/themes/default/sections/ExperienceDetails";
import { notFound } from "next/navigation";
import { siteConfig } from '@/config/client-data';

// --- ▼▼▼ CHANGES START HERE ▼▼▼ ---

// 1. Import our server-side loader
import { getComponentImport } from "@/lib/theme-component-loader";

// 2. REMOVE the old 'theme' variable
// const theme = process.env.NEXT_PUBLIC_THEME || 'default'; // <-- REMOVED

// 3. Use getComponentImport to load the component
// We keep the .then((mod) => mod.default) as it was in your original code
const ExperienceDetails = dynamic<ExperienceDetailsProps>(() =>
  getComponentImport('ExperienceDetails', 'sections')().then((mod) => mod.default)
);

// --- ▲▲▲ CHANGES END HERE ▲▲▲ ---


// --- UPGRADED METADATA FUNCTION ---
type ExperienceMetadata = Promise<{
  id: string;
  locale: string;
}>;
export async function generateMetadata({ params }: { params: ExperienceMetadata }): Promise<Metadata> {
  const {id, locale} = await params;

  if (!siteConfig.hasExperiencesSection) {
    return {
      title: 'Not Found',
      description: 'The experiences feature is currently disabled.',
    };
  }

  const experience = (await getExperienceById(id)) as Experience | null;
  if (!experience) { return { title: 'Experience Not Found' }; }

  return generateDynamicPageMetadata({
    title: experience.translations?.[locale]?.title || experience.translations?.fr?.title || 'Experience Not Available',
    description: experience.translations?.[locale]?.description?.substring(0, 160) + '...' || experience.translations?.fr?.description?.substring(0, 160) + '...' ,
    images: [{ src: experience.coverImage || '', alt: experience.translations?.[locale]?.title || '' }],
    pathname: `/experiences/${id}`,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com",
  });
}

type Params = Promise<{ id: string, locale: string }>;
export default async function ExperienceDetailPage({ params }: { params: Params }) {
  if (!siteConfig.hasExperiencesSection) {
    notFound(); 
  }

  const { id, locale } = await params;
  const experienceData = (await getExperienceById(id)) as Experience | null;
  
  const experience = {
    ...experienceData,
    title: experienceData?.translations?.[locale]?.title || experienceData?.translations?.en?.title || 'Title Not Available',
    description: experienceData?.translations?.[locale]?.description || experienceData?.translations?.en?.description || 'Description Not Available',
  } as Experience;
  const reviewSummary = await getReviewSummary(id);
  const translation = experience.translations?.[locale] || experience.translations?.en;
  
  // --- JSON-LD STRUCTURED DATA ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: translation?.title,
    description: translation?.description?.substring(0, 5000),
    image: experience.coverImage,
    offers: {
      '@type': 'Offer',
      price: experience.price.amount,
      priceCurrency: experience.price.currency,
      availability: 'https://schema.org/InStock',
    },
    ...(reviewSummary.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewSummary.averageRating,
        reviewCount: reviewSummary.reviewCount,
      },
    }),
  };
  if (!experienceData) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
          
      <ExperienceDetails 
          experience={experienceData}
          clientConfig={{
            plugins: {
                hasReviews: siteConfig.hasReviewsSystem,
                hasBookingEngine: siteConfig.hasBookingEngine,
            }
          }}
      />
    </section>
  );
}