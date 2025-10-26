// src/components/custom/MainHeadingUserContent.tsx

import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

// Define the type for the props the component will accept
export interface MainHeadingUserContentProps {
  title: string; // Directly accepts the title text, no translation key
  sx?: SxProps<Theme>; // Optional sx prop to allow for style overrides
  variant?: TypographyProps['variant'];
  component?: React.ElementType;
}

const MainHeadingUserContent: React.FC<MainHeadingUserContentProps> = ({
  title,
  sx = {},
  variant = 'h1',
  component = 'h1',
}) => {
  return (
    <Typography
      variant={variant}
      component={component}
      sx={{
        fontWeight: 800,
        fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem' },
        mb: 3,
        textShadow: '0 4px 24px rgba(0,0,0,0.7)',
        ...sx, 
      }}
    >
{title} 
    </Typography>
  );
};

export default MainHeadingUserContent;