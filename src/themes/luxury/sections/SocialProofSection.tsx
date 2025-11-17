// /src/themes/luxury/sections/SocialProofSection.tsx (UPDATED)
'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';
import Image from 'next/image';
import { WebsiteLanguage } from '@/config/types'; // <-- Import the type

// --- DELETED the hard-coded partnerLogos array ---

export default function SocialProofSection() {
  const locale = useLocale() as WebsiteLanguage; // <-- Cast to your type
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  // --- NEW: DYNAMIC LOGIC ---
  // Get both arrays from siteConfig. Default to empty arrays.
  const { trustBadges = [], partnerLogos = [] } = siteConfig;

  // Prioritize official 'trustBadges'. If they exist, use them.
  // Otherwise, fall back to the informal 'partnerLogos'.
  const logosToShow = trustBadges.length > 0 ? trustBadges : partnerLogos;

  // If *neither* list has any logos, do not render the component.
  if (logosToShow.length === 0) {
    return null;
  }
  // --- END OF NEW LOGIC ---

  return (
  	<Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
    	<Container maxWidth="md">
      	<Typography
        	sx={{
          	textAlign: 'center',
          	color: 'text.secondary',
          	fontWeight: 'bold',
          	textTransform: 'uppercase',
          	letterSpacing: 2,
          	mb: 6, // Kept your original 'mb: 6'
        	}}
      	>
        	{/* This title is now dynamic, e.g., "Our Trusted Partners" */}
        	{content.socialProofTitle}
      	</Typography>
      	
      	<Box
        	sx={{
          	width: '100%',
          	overflow: 'hidden',
          	maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          	WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        	}}
      	>
        	<Box
          	sx={{
            	display: 'flex',
            	width: 'fit-content',
            	'@keyframes scroll': {
              	'0%': { transform: 'translateX(0)' },
              	'100%': { transform: 'translateX(-50%)' },
            	},
            	animation: 'scroll 40s linear infinite',
            	'&:hover': {
              	animationPlayState: 'paused',
            	},
          	}}
        	>
          	{/* --- UPDATED: Render the dynamic 'logosToShow' array --- */}
         {[...logosToShow, ...logosToShow].map((logo, index) => (
            	<Box
              	key={`${logo.name}-${index}`}
              	sx={{
              	  position: 'relative',
              	  width: { xs: 130, sm: 160 },
              	  height: { xs: 65, sm: 80 },
              	  mx: { xs: 3, sm: 5 },
              	  flexShrink: 0,
                    // Kept your original luxury theme filter/opacity style
              	  filter: (theme) =>
                	  theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
              	  opacity: 0.5,
              	  transition: 'opacity 0.4s ease-in-out',
              	  '&:hover': {
                	  opacity: 1,
               },
              	}}
            	>
              	<Image
                	src={logo.url}
               	alt={`${logo.name} - ${siteConfig.siteName}`}
                	fill
                	loading='lazy'
                	style={{
                  	objectFit: 'contain',
               }}
                	sizes="160px"
              	/>
            	</Box>
          	))}
          </Box>
      	</Box>
    	</Container>
  	</Box>
  );
}