"use client";

// 1. Import the props type (from default, as your blog page does)
import type { ResponsiveHeadingProps } from "@/themes/default/custom/ResponsiveHeading";

// 2. Import the *base* component from the theme you fall back to (adventure)
// We give it a new name 'BaseResponsiveHeading' to avoid a name conflict.
import BaseResponsiveHeading from '@/themes/adventure/custom/ResponsiveHeading';

// 3. Import MUI components for the "TEST" badge
import { Box, Chip } from "@mui/material";

// 4. Create the new override component
export default function OverriddenResponsiveHeading(props: ResponsiveHeadingProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {/* Render the original component with all its props */}
      <BaseResponsiveHeading {...props} /> 
      
      {/* Add our test badge */}
      <Chip label="TEST" color="error" size="small" />
    </Box>
  );
}