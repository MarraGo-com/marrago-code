'use client';

import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItemButton, 
  ListItemText, IconButton, Typography, Collapse, 
  Divider, Button, Stack 
} from '@mui/material';
import { 
  Close, ExpandLess, ExpandMore, 
  FlightTakeoff, Category, Book 
} from '@mui/icons-material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { siteConfig } from '@/config/client-data';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// --- IMPORT CENTRAL CONFIG ---
import { NAV_DESTINATIONS, NAV_INTERESTS } from '@/config/navigation';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations('Header');
  const tLoc = useTranslations('Locations'); // <--- 1. Hook for Locations
  const tInt = useTranslations('Interests'); // <--- 2. Hook for Interests
  
  // State for collapsible sub-menus
  const [openDestinations, setOpenDestinations] = useState(false);
  const [openInterests, setOpenInterests] = useState(false);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '85%', maxWidth: 360, bgcolor: 'background.default' }
      }}
    >
      {/* 1. DRAWER HEADER */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
           <Box sx={{ position: 'relative', width: 30, height: 30 }}>
               <Image src={siteConfig.logo} alt="Logo" fill style={{ objectFit: 'contain' }} />
           </Box>
           <Typography variant="h6" fontWeight="bold">{siteConfig.brandName}</Typography>
        </Stack>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* 2. MAIN MENU ITEMS */}
      <List component="nav" sx={{ px: 1 }}>
        
        {/* A. DESTINATIONS (Dynamic) */}
        <ListItemButton onClick={() => setOpenDestinations(!openDestinations)}>
          <FlightTakeoff sx={{ mr: 2, color: 'text.secondary' }} />
          <ListItemText primary={t('navDestinations')} primaryTypographyProps={{ fontWeight: 600 }} />
          {openDestinations ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDestinations} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {NAV_DESTINATIONS.map((item) => (
                <ListItemButton 
                    key={item.id} 
                    sx={{ pl: 9 }} 
                    component={Link} 
                    href={item.link} // Use link from config
                    onClick={onClose}
                >
                  {/* Localize Title using ID */}
                  <ListItemText primary={tLoc(`${item.id}.title`)} />
                </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* B. INTERESTS (Dynamic) */}
        <ListItemButton onClick={() => setOpenInterests(!openInterests)}>
          <Category sx={{ mr: 2, color: 'text.secondary' }} />
          <ListItemText primary={t('navInterests')} primaryTypographyProps={{ fontWeight: 600 }} />
          {openInterests ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openInterests} timeout="auto" unmountOnExit>
           <List component="div" disablePadding>
            {NAV_INTERESTS.map((item) => (
                <ListItemButton 
                    key={item.id} 
                    sx={{ pl: 9 }} 
                    component={Link} 
                    href={item.link} 
                    onClick={onClose}
                >
                  {/* Localize Title using ID */}
                  <ListItemText primary={tInt(`${item.id}.title`)} />
                </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* C. JOURNAL */}
        <ListItemButton component={Link} href="/blog" onClick={onClose}>
          <Book sx={{ mr: 2, color: 'text.secondary' }} />
          <ListItemText primary={t('navJournal')} primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>

      </List>

      <Divider sx={{ my: 1 }} />

      {/* 3. UTILITIES & CTA */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Settings
        </Typography>
        
        <Box sx={{ mb: 3 }}>
           <LanguageSwitcher />
        </Box>

        <Button 
            variant="contained" 
            fullWidth 
            size="large"
            component={Link}
            href="/planning"
            onClick={onClose}
            sx={{ 
                borderRadius: 50, 
                fontWeight: 'bold', 
                py: 1.5,
                boxShadow: 2
            }}
        >
            {t('ctaPlanTrip')}
        </Button>
      </Box>
    </Drawer>
  );
}