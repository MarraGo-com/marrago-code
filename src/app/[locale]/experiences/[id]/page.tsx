
// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/experiences/[id]/page.tsx
// This page now only needs to render the main layout and the refactored details component.
// The review components will be moved inside the main details component later if needed.
// -------------------------------------------------------------------------
// import Header from "@/components/ui/Header";
import dynamic from "next/dynamic";
const theme = process.env.NEXT_PUBLIC_THEME || 'default';
// Dynamically import Header and Footer components
// const ExperienceDetails = dynamic(() => import(`@/themes/${theme}/sections/ExperienceDetails`));
const ExperienceDetails = dynamic<ExperienceDetailsProps>(() =>
  import(`@/themes/${theme}/sections/ExperienceDetails`).then((mod) => mod.default)
);

import { getExperienceById, getReviewSummary } from "@/lib/data";
import { Experience } from "@/types/experience";
import { Metadata } from "next";
import { generateDynamicPageMetadata } from "@/lib/metadata";
import { ExperienceDetailsProps } from "@/themes/default/sections/ExperienceDetails";
import { notFound } from "next/navigation";

async function getClientConfig() {
  return {
    plugins: { 
      hasReviews: true,
      hasBookingEngine: true,
      hasBlog: true,
      }
  };
}

// --- UPGRADED METADATA FUNCTION ---
type ExperienceMetadata = Promise<{
  id: string;
  locale: string;
}>;
export async function generateMetadata({ params }: { params: ExperienceMetadata }): Promise<Metadata> {
  const {id, locale} = await params;
  const experience = (await getExperienceById(id)) as Experience | null;
  if (!experience) { return { title: 'Experience Not Found' }; }



// Use the fetched data to generate the metadata.
  return generateDynamicPageMetadata({
    title: experience.translations?.[locale]?.title || experience.translations?.fr?.title || 'Experience Not Available',
    description: experience.translations?.[locale]?.description.substring(0, 160) + '...' || experience.translations?.fr?.description.substring(0, 160) + '...' ,
    images: [{ src: experience.coverImage || '', alt: experience.title || '' }],
    pathname: `/experiences/${id}`,
    url: process.env.NEXT_PUBLIC_API_URL || "https://upmerce.com", // Ensure you have this environment variable set

  });
}

type Params = Promise<{ id: string, locale: string }>;
export default async function ExperienceDetailPage({ params }: { params: Params }) {
  const { id, locale } = await params;
  const experienceData = (await getExperienceById(id)) as Experience | null;
  const clientConfig = await getClientConfig();
  
  const experience = {
    ...experienceData,
    title: experienceData?.translations?.[locale]?.title || experienceData?.translations?.en?.title || 'Title Not Available',
    description: experienceData?.translations?.[locale]?.description || experienceData?.translations?.en?.description || 'Description Not Available',
  } as Experience;
  const reviewSummary = await getReviewSummary(id);
  const translation = experience.translations?.[locale] || experience.translations?.en;
 // const siteUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // --- JSON-LD STRUCTURED DATA ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: translation?.title,
    description: translation?.description?.substring(0, 5000), // Max length for description
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
  // The page now only renders ONE component and passes all necessary data down
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
        clientConfig={clientConfig} 
    />
      </section>
  );
}
