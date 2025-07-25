
// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/experiences/[id]/page.tsx
// This page now only needs to render the main layout and the refactored details component.
// The review components will be moved inside the main details component later if needed.
// -------------------------------------------------------------------------
// import Header from "@/components/ui/Header";

import ExperienceDetails from "@/components/sections/ExperienceDetails";
import { Box, Container, Divider } from "@mui/material";
import ReviewsList from "@/components/reviews/ReviewsList";
import LeaveReviewForm from "@/components/reviews/LeaveReviewForm";
import { getExperienceById, getReviewSummary } from "@/lib/data";
import { Experience } from "@/types/experience";
import { Metadata } from "next";
import { generateDynamicPageMetadata } from "@/lib/metadata";

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
  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
         <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      // ✅ **FIX:** Add this style to prevent horizontal scroll from child components
      '& .main-content': {
        overflowX: 'hidden',
      }
    }}>
      {/* <Header /> */}
      {/* ✅ **FIX:** Add the corresponding className here */}
      <main className="main-content flex-grow">
        <ExperienceDetails experience={experience} />
        
        {clientConfig?.plugins?.hasReviews && (
          <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
              <Divider sx={{ my: 8 }} />
              <ReviewsList experienceId={id} />
              <LeaveReviewForm experienceId={id} />
          </Container>
        )}
      </main>
     {/*  <Footer /> */}
    </Box>
      </main>
    </>
  );
}
