"use client";

// 1. Import the *base* component from the 'adventure' theme
//    (This is your site's fallback theme)
import BaseAboutSection from '@/themes/adventure/sections/AboutSection';

// 2. Import MUI components for the test banner
import { Box, Typography, Container } from "@mui/material";

// 3. Create the new override component
export default function OverriddenAboutSection() {
  return (
    <Box>
      {/* Add our test banner */}
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            py: 1, 
            textAlign: 'center',
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            TEST OVERRIDE: AboutSection
          </Typography>
        </Box>
      </Container>
      
      {/* Render the original component with all its props */}
      <BaseAboutSection /> 
    </Box>
  );
}