// /src/components/sections/TestimonialsSection.tsx (UPDATED)

import { Grid, Box, Typography, Container } from "@mui/material";
// REMOVED: getTranslations is no longer needed
// import { getTranslations } from "next-intl/server";
import { getLocale } from 'next-intl/server'; // NEW: For getting locale in Server Components

// NEW: Import client data

import TestimonialCard from "@/components/reviews/TestimonialCard";
// UPDATED: Use MainHeadingUserContent for direct title prop
import { Review } from "@/types/review";
import { getFeaturedReviews } from "@/lib/data";
import MainHeadingUserContent from "@/components/custom/MainHeadingUserContent";
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
            sx={{ fontWeight: 'bold', mb: 2 }} 
          />
          {/* UPDATED: Typography now gets subtitle from client data */}
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.testimonialsSubtitle}
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {reviews.map((review: Review) => (
            <Grid key={review.id} size={{ xs: 12, sm: 8, md: 4 }}>
              <TestimonialCard review={review} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}