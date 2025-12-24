'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from '@/i18n/navigation'; // Assuming you use next-intl navigation
import HomeIcon from '@mui/icons-material/Home';

export interface BreadcrumbItem {
  label: string;
  href?: string; // Optional: The last item (current page) usually has no link
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
      <MuiBreadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />} 
        aria-label="breadcrumb"
      >
        {/* Always show Home first */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
           <HomeIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5, '&:hover': { color: 'primary.main' } }} />
           <Typography variant="caption" color="text.secondary" sx={{ '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}>
             Home
           </Typography>
        </Link>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return isLast ? (
            // Last item: Text only (Current Page)
            <Typography key={item.label} variant="caption" color="text.primary" fontWeight="bold">
              {item.label}
            </Typography>
          ) : (
            // Middle items: Links
            <Link key={item.label} href={item.href || '#'} style={{ textDecoration: 'none' }}>
              <Typography variant="caption" color="text.secondary" sx={{ '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}>
                {item.label}
              </Typography>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}