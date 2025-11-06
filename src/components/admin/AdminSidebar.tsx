// -------------------------------------------------------------------------
// 4. UPDATED FILE: /src/components/admin/AdminSidebar.tsx
// Add the new "Bookings" link to the sidebar navigation.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl'; // <-- NEW: Import useTranslations
import { siteConfig } from '@/config/client-data';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'; // More generic for Experiences
import SettingsIcon from '@mui/icons-material/Settings'; // Example for a potential Settings page

// Define navigation items conditionally where applicable
type NavItem = { text: string; href: string; icon: React.ReactElement };

const getNavItems = (t: any): NavItem[] => {
  const items: (NavItem | false)[] = [
    // Always show Dashboard if it's the main entry
    { text: t('dashboard'), href: '/admin/dashboard', icon: <DashboardIcon /> },
    // Condition Blog link
    siteConfig.hasBlogSystem ? { text: t('blog'), href: '/admin/blog', icon: <ArticleIcon /> } : false,
    // Condition Experiences link
    siteConfig.hasExperiencesSection ? { text: t('experiences'), href: '/admin/dashboard', icon: <CollectionsBookmarkIcon /> } : false, // Assuming you'll have an admin experiences page
    // Condition Bookings link
    siteConfig.hasBookingEngine ? { text: t('bookings'), href: '/admin/bookings', icon: <BookOnlineIcon /> } : false,
    // Condition Reviews link
    siteConfig.hasReviewsSystem ? { text: t('reviews'), href: '/admin/reviews', icon: <RateReviewIcon /> } : false,
    // Example: You might want a Settings page that is always available or also conditional
    { text: t('settings'), href: '/admin/settings', icon: <SettingsIcon /> },
  ];

  // Type guard filters out falsy entries so the result is NavItem[]
  return items.filter((v): v is NavItem => Boolean(v));
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations('admin.AdminSidebar'); // Assuming an AdminSidebar translation namespace

  const navItems = getNavItems(t);

  return (
    <Box sx={{ width: 240, flexShrink: 0, bgcolor: 'background.paper', height: '100vh', borderRight: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t('adminPanel')}</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          // isActive logic remains the same
          const isActive = pathname.startsWith(`/en${item.href}`) || pathname.startsWith(`/fr${item.href}`);
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} href={item.href} selected={isActive}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}