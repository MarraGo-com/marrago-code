"use client";

// 1. Import the props type (from default, as your page file does)
import type { PostLayoutProps } from '@/themes/default/blog/PostLayout';

// 2. Import the *base* component from the 'default' theme
//    (This path is updated based on the file you sent)
import BasePostLayout from '@/themes/default/blog/PostLayout';
import { Box, Typography } from '@mui/material';

// 3. Import MUI components for the test banner

// 4. Create the new override component
export default function OverriddenPostLayout(props: PostLayoutProps) {
  return (
    <Box>
      {/* Add our test banner */}
      <Box 
        sx={{ 
          bgcolor: 'error.main', 
          color: 'white', 
          py: 1, 
          textAlign: 'center' 
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          TEST OVERRIDE: PostLayout
        </Typography>
      </Box>

      {/* Render the original component with all its props */}
      <BasePostLayout {...props} /> 
    </Box>
  );
}