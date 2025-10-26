// /src/themes/adventure/sections/TestimonialsSection.tsx (UPDATED)

import { Box, Typography, Container } from "@mui/material";
// REMOVED: getTranslations is no longer needed
// import { getTranslations } from "next-intl/server";
import { getLocale } from 'next-intl/server'; // NEW: For getting locale in Server Components

// NEW: Import client data

// UPDATED: Use MainHeadingUserContent for direct title prop
import MainHeadingUserContent from '../../../components/custom/MainHeadingUserContent';
import { Review } from "@/types/review";
import { getFeaturedReviews } from "@/lib/data";
import TestimonialsSlider from "../reviews/TestimonialsSlider";
import { siteConfig } from "@/config/client-data";

export default async function TestimonialsSection() {
  const reviews = (await getFeaturedReviews()) as Review[] | null;
  // REMOVED: const t = await getTranslations('Testimonials');

  // NEW: Get locale and content from the client data file
  const locale = (await getLocale()) as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  if (!reviews || reviews.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          {/* UPDATED: MainHeadingUserContent now gets title from client data */}
          <MainHeadingUserContent 
            title={content.testimonialsTitle}
            variant="h2"
            component="h2"
            sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2 }} 
          />
          {/* UPDATED: Typography now gets subtitle from client data */}
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.testimonialsSubtitle}
          </Typography>
        </Box>

        {/* This part remains unchanged, passing fetched reviews to the client component */}
        <TestimonialsSlider reviews={reviews} />
      </Container>
    </Box>
  );
}