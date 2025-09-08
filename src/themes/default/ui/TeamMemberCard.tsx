// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/components/ui/TeamMemberCard.tsx
// The Avatar component is now optimized to use next/image.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Paper, Typography, Avatar } from '@mui/material';
import Image from 'next/image'; // <-- Import the Next.js Image component

export interface TeamMemberCardProps {
  image: string;
  name: string;
  title: string;
  bio: string;
}

export default function TeamMemberCard({ image, name, title, bio }: TeamMemberCardProps) {
  return (
    <Paper 
      elevation={4}
      sx={{ p: 3, textAlign: 'center', height: '100%', bgcolor: 'background.paper' }}
    >
      <Avatar
        alt={name}
        // We use the src prop as a fallback, but the Image component will be primary
        src={image} 
        sx={{
          width: 120,
          height: 120,
          mx: 'auto',
          mb: 2,
          border: '4px solid',
          borderColor: 'primary.main'
        }}
      >
        {/* By placing the optimized Image component inside the Avatar,
            it will be rendered instead of the default <img> tag. */}
        <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            style={{ objectFit: 'cover' }}
            sizes="120px"
        />
      </Avatar>
      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
        {name}
      </Typography>
      <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {bio}
      </Typography>
    </Paper>
  );
}
