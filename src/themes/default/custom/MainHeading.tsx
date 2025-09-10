import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

// Define the type for the props the component will accept
export interface MainHeadingProps {
  titleKey: string;
  t: (key: string) => string; // Represents a translation function like i18next
  sx?: SxProps<Theme>; // Optional sx prop to allow for style overrides
  // --- 1. Add optional variant and component props ---
  variant?: TypographyProps['variant'];
  component?: React.ElementType;
}

const MainHeading: React.FC<MainHeadingProps> = ({
  titleKey,
  t,
  sx = {},
  // --- 2. Set default values for the new props ---
  variant = 'h1',
  component = 'h1',
}) => {
  return (
    <Typography
      // --- 3. Use the props (or their default values) ---
      variant={variant}
      component={component}
      sx={{
        fontWeight: 800,
        fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem' },
        mb: 3,
        textShadow: '0 4px 24px rgba(0,0,0,0.7)',
        ...sx, // Spread any additional sx props
      }}
    >
      {t(titleKey)}
    </Typography>
  );
};

export default MainHeading;