// /src/themes/luxury/sections/TestimonialsSection.tsx (UPDATED)

import { Box, Typography, Container, Avatar } from '@mui/material';
// REMOVED: getTranslations is no longer needed
// import { getTranslations } from "next-intl/server";
import { getLocale } from 'next-intl/server'; // NEW: For getting locale in Server Components

// NEW: Import client data

// UPDATED: Use MainHeadingUserContent for direct title prop
import MainHeadingUserContent from '../../../components/custom/MainHeadingUserContent';
import { Review } from "@/types/review";
import { getFeaturedReviews } from "@/lib/data";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { siteConfig } from '@/config/client-data';

export default async function TestimonialsSection() {
  const reviews = (await getFeaturedReviews()) as Review[] | null;
  // REMOVED: const t = await getTranslations('Testimonials');
  
  // NEW: Get locale and content from the client data file
  const locale = (await getLocale()) as 'en' | 'fr' | 'ar';
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  if (!reviews || reviews.length === 0) {
    return null; 
  }

  // This logic remains the same
  const featuredReview = reviews[0];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        {/* UPDATED: MainHeadingUserContent now gets title and subtitle from client data */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MainHeadingUserContent 
            title={content.testimonialsTitle}
            variant="h2"
            component="h2"
            sx={{ 
              fontWeight: 500,
              mb: 2, // Adjust margin to make space for subtitle
            }} 
          />
          <Typography variant="h6" component="p" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {content.testimonialsSubtitle}
          </Typography>
        </Box>

        {/* This section for displaying the review remains unchanged */}
        <Box sx={{ textAlign: 'center' }}>
          <FormatQuoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3, transform: 'rotate(180deg)' }} />
          
          <Typography 
            variant="h4" 
            component="blockquote" 
            sx={{ 
              fontStyle: 'italic',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            {featuredReview.text}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {featuredReview.avatar && (
              <Avatar 
                alt={featuredReview.author} 
                src={featuredReview.avatar}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
            )}
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
                {featuredReview.author}
              </Typography>
              {featuredReview.location && (
                <Typography variant="body1" color="text.secondary">
                  {featuredReview.location}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}