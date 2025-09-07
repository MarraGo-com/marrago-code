// /src/components/ui/FeatureCard.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

// --- 1. Define a more specific type for the icon's props ---
// This tells TypeScript that the icon we pass can accept an `sx` prop.
interface IconProps {
  sx?: SxProps<Theme>;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Paper 
      elevation={3} 
      sx={{
        p: 3,
        textAlign: 'center',
        height: '100%',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        {React.isValidElement(icon)
          // --- 2. Use the new, more specific type instead of  ---
          ? React.cloneElement(icon as React.ReactElement<IconProps>, { sx: { fontSize: 50 } })
          : icon}
      </Box>
      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Paper>
  );
}
