// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/ui/ThemeSwitcher.tsx
// This is the floating settings panel that allows users to change the theme.
// -------------------------------------------------------------------------
'use client';

import React, { useState } from 'react';
import { Box, IconButton, Drawer, Typography, Divider, Button, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';
import { PaletteName, FontChoice, CardStyle } from '@/config/site';

export default function ThemeSwitcher() {
  const t = useTranslations('ThemeSwitcher');
  const [isOpen, setIsOpen] = useState(false);
  const { 
    palette, setPalette, 
    font, setFont, 
    cardStyle, setCardStyle 
  } = useThemeContext();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const palettes: { name: string, id: PaletteName }[] = [
    { name: t('paletteCoastal'), id: 'coastalBlue' },
    { name: t('paletteDesert'), id: 'desertSunset' },
    { name: t('paletteLuxe'), id: 'luxeNoir' },
  ];

  const fonts: { name: string, id: FontChoice }[] = [
    { name: t('fontModern'), id: 'poppins' },
    { name: t('fontElegant'), id: 'lora' },
  ];

  const cardStyles: { name: string, id: CardStyle }[] = [
    { name: t('cardImmersive'), id: 'immersive' },
    { name: t('cardClassic'), id: 'classic' },
  ];

  return (
    <>
      <Tooltip title={t('tooltip')} arrow>
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1301 }}>
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: 6,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Tooltip>

      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 280, p: 2, bgcolor: 'background.default', height: '100%' }}
          role="presentation"
        >
          <Typography variant="h6" sx={{ mb: 2 }}>{t('panelTitle')}</Typography>
          <Divider />

          {/* Color Palette Section */}
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{t('colorTitle')}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {palettes.map(p => (
                <Button key={p.id} onClick={() => setPalette(p.id)} variant={palette === p.id ? 'contained' : 'outlined'} size="small">
                  {p.name}
                </Button>
              ))}
            </Box>
          </Box>
          <Divider />

          {/* Font Section */}
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{t('fontTitle')}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {fonts.map(f => (
                <Button key={f.id} onClick={() => setFont(f.id)} variant={font === f.id ? 'contained' : 'outlined'} size="small">
                  {f.name}
                </Button>
              ))}
            </Box>
          </Box>
          <Divider />

          {/* Card Style Section */}
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{t('cardTitle')}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {cardStyles.map(cs => (
                <Button key={cs.id} onClick={() => setCardStyle(cs.id)} variant={cardStyle === cs.id ? 'contained' : 'outlined'} size="small">
                  {cs.name}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
