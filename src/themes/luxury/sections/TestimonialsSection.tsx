import { Box, Typography, Container } from "@mui/material";
import { getLocale } from 'next-intl/server'; 
import { siteConfig } from "@/config/client-data";
import { getFeaturedReviews } from "@/lib/data";
import { Review } from "@/types/review";

// UPDATED: Using your custom heading component
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import TestimonialsSlider from "@/themes/adventure/reviews/TestimonialsSlider";


export default async function TestimonialsSection() {
  // 1. Fetch Real Data (Server Side)
  // This now returns reviews with 'isVerifiedBooking', 'travelerType', etc.
  const reviews = (await getFeaturedReviews()) as Review[] | null;

  // 2. Get Locale for static content (Titles/Subtitles)
  const locale = (await getLocale()) as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  // 3. Safety Check: Don't render empty sections
  if (!reviews || reviews.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        
        {/* --- SECTION HEADER --- */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeadingUserContent 
            title={content.testimonialsTitle}
            variant="h2"
            component="h2"
            sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2 }} 
          />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.testimonialsSubtitle}
          </Typography>
        </Box>

        {/* --- THE VERIFIED EVIDENCE ENGINE --- */}
        {/* Passes the enriched data to the client-side slider */}
        <TestimonialsSlider reviews={reviews} />

      </Container>
    </Box>
  );
}