// /src/themes/luxury/ui/MainHeaderNavigation.tsx
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

// --- THIS IS THE KEY CHANGE ---
// The 'isScrolled' prop is no longer needed and has been removed.
interface MainHeaderNavigationProps {
  textColor: string;
  isMenuOpen: boolean;
  setActiveMenu: (menu: string | null) => void;
}

export default function MainHeaderNavigation({ 
  textColor,
//  isMenuOpen, // This prop is still needed for the logo filter
  setActiveMenu 
}: MainHeaderNavigationProps) {
  const t = useTranslations('MainHeaderNav');

  const navLinks = [
    { id: 'find-hotel', text: t('findHotel'), href: '/experiences' },
    { id: 'get-inspired', text: t('getInspired'), href: '/blog' },
    { id: 'offers', text: t('offers'), href: '/#pricing' },
    { id: 'leaders-club', text: t('leadersClub'), href: '/about' },
  ];

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 80,
      }}
    >
      <Box 
        sx={{
          width: '80%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/favicon.ico" 
            alt={`${siteConfig.siteName} logo`}
            width={50} 
            height={50} 
            priority
            style={{ 
              // We use isMenuOpen here to decide the filter
            //  filter: textColor === 'common.white' && !isMenuOpen ? 'brightness(0) invert(1)' : 'none', 
              transition: 'filter 0.3s ease-in-out' 
            }}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              ml: 2, 
              color: textColor,
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            {siteConfig.siteName}
          </Typography>
        </Link>

        {/* Right Side: All Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {navLinks.map((link) => (
            <Button
              key={link.id}
              color="inherit"
              onMouseEnter={() => setActiveMenu(link.id)}
              component={Link}
              href={link.href}
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.875rem',
                color: textColor,
                textTransform: 'uppercase',
              }}
            >
              {link.text}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}