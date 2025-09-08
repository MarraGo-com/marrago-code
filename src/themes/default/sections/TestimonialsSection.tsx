// -------------------------------------------------------------------------
// 3. NEW FILE: /src/components/sections/TestimonialsSection.tsx
// This Server Component fetches the featured reviews and displays them.
// -------------------------------------------------------------------------
import {Grid, Box, Typography, Container } from "@mui/material";

import { getTranslations } from "next-intl/server";
import TestimonialCard from "@/components/reviews/TestimonialCard";
import MainHeading from "../custom/MainHeading";
import { Review } from "@/types/review";
import { getFeaturedReviews } from "@/lib/data";

/* async function getFeaturedReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/featured`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
     console.log("Fetched reviews===============================================================> :", JSON.stringify(data)); // Debugging output

    return data.reviews;
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }
} */

export default async function TestimonialsSection() {
  const reviews = (await getFeaturedReviews()) as Review[] | null;
  const t = await getTranslations('Testimonials');
  if (!reviews || reviews.length === 0) {
    return null; // Don't render the section if there are no featured reviews
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeading 
             titleKey='title' 
              variant="h2"
              component="h2"
             t={t} 
             sx={{ fontWeight: 'bold', mb: 2 }} />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {reviews.map((review: Review) => (
            <Grid key={review.id}  size={{ xs: 12, sm: 8, md: 4 }}>
              <TestimonialCard review={review} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}