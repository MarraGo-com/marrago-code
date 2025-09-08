import React, { ElementType } from 'react';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

// Define the props for our reusable component
export interface ResponsiveHeadingProps {
  /**
   * The text or content to be displayed inside the heading.
   */
  children: React.ReactNode;
  /**
   * The HTML tag to be rendered (e.g., 'h1', 'h2'). Defaults to 'h1'.
   */
  component?: ElementType;
  /**
   * Allows for additional custom styling to be passed from the parent.
   */
  sx?: SxProps<Theme>;
}

const ResponsiveHeading: React.FC<ResponsiveHeadingProps> = ({
  children,
  component = 'h1', // Default to 'h1' for semantic importance
  sx = {},
}) => {
  return (
    <Typography
      variant="h2" // We use 'h2' for styling but the actual tag is controlled by the 'component' prop
      component={component}
      sx={{
        // Default styles for the heading
        fontWeight: 'bold',
        fontSize: {
          xs: '2.2rem',  // Mobile
          sm: '2.8rem',  // Tablet
          md: '3.5rem',  // Desktop
          lg: '4rem',    // Large Desktop
        },
        lineHeight: 1.2,
        mb: 2,
        // Merge with custom styles passed via props, allowing overrides
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default ResponsiveHeading;