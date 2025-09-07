// /src/themes/luxury/sections/TestimonialsSection.tsx

import { Box, Typography, Container, Avatar } from '@mui/material';
import { getTranslations } from "next-intl/server";
import MainHeading from '../../default/custom/MainHeading'; // Reusing the shared MainHeading
import { Review } from "@/types/review";
import { getFeaturedReviews } from "@/lib/data";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export default async function TestimonialsSection() {
  const reviews = (await getFeaturedReviews()) as Review[] | null;
  const t = await getTranslations('Testimonials');

  // Don't render the section if there are no featured reviews
  if (!reviews || reviews.length === 0) {
    return null; 
  }

  // For this luxury theme, we will prominently feature only the FIRST review.
  const featuredReview = reviews[0];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="md"> {/* Use a medium container to keep it focused */}
        <MainHeading 
           titleKey='title' 
           variant="h2"
           component="h2"
           t={t} 
           sx={{ 
             textAlign: 'center',
            // fontFamily: 'lora, serif',
             fontWeight: 500,
             mb: 8, // More space
           }} 
        />

        {/* --- This is the new, elegant single testimonial display --- */}
        <Box sx={{ textAlign: 'center' }}>
          <FormatQuoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3, transform: 'rotate(180deg)' }} />
          
          <Typography 
            variant="h4" 
            component="blockquote" 
            sx={{ 
             // fontFamily: 'lora, serif', 
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
            {/* The Avatar will be displayed if a URL is provided in your data */}
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
              {/* This will be displayed if 'location' is part of your Review type */}
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