// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/ui/AnimatedLink.tsx
// This is a new, reusable component for links with a beautiful hover effect.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Link } from '@/i18n/navigation';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function AnimatedLink({ href, children }: AnimatedLinkProps) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-block',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          transform: 'scaleX(0)',
          height: '2px',
          bottom: 0,
          left: 0,
          backgroundColor: 'primary.main',
          transformOrigin: 'bottom right',
          transition: 'transform 0.25s ease-out',
        },
        '&:hover::after': {
          transform: 'scaleX(1)',
          transformOrigin: 'bottom left',
        },
      }}
    >
      {children}
    </Box>
  );
}
