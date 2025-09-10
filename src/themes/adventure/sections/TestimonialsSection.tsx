// /src/themes/adventure/sections/TestimonialsSection.tsx

import { Box, Typography, Container } from "@mui/material";
import { getTranslations } from "next-intl/server";
import MainHeading from '../../default/custom/MainHeading';
import { Review } from "@/types/review";
import { getFeaturedReviews } from "@/lib/data";
import TestimonialsSlider from "../reviews/TestimonialsSlider"; // Import the new client component

export default async function TestimonialsSection() {
  const reviews = (await getFeaturedReviews()) as Review[] | null;
  const t = await getTranslations('Testimonials');

  if (!reviews || reviews.length === 0) {
    return null; 
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
            sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2 }} 
          />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        {/* --- THIS IS THE KEY CHANGE --- */}
        {/* The Server Component renders the Client Component with the fetched data */}
        <TestimonialsSlider reviews={reviews} />
      </Container>
    </Box>
  );
}