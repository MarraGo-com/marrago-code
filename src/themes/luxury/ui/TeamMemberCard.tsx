// /src/themes/luxury/ui/TeamMemberCard.tsx
'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export interface TeamMemberCardProps {
  image: string;
  name: string;
  title: string;
  bio?: string;
}

export default function TeamMemberCard({ image, name, title }: TeamMemberCardProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Avatar
        alt={name}
        src={image}
        sx={{
          width: 160,
          height: 160,
          mx: 'auto',
          mb: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      />
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          fontWeight: 'bold', 
          fontFamily: '"Oranienbaum", serif',
          color: 'text.primary' 
        }}
      >
        {name}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
    </Box>
  );
}