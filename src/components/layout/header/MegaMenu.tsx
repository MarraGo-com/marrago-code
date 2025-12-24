'use client';

import React, { useState } from 'react';
import { 
  Box, Grid, Typography, Paper, Fade, Card, 
  CardMedia, IconButton, keyframes, 
  useTheme
} from '@mui/material';
import { Link } from '@/i18n/navigation';
import { ArrowForward, ArrowBack, ArrowForwardIos } from '@mui/icons-material';
import * as MuiIcons from '@mui/icons-material';
import { NAV_DESTINATIONS, NAV_INTERESTS } from '@/config/navigation';
import { useTranslations } from 'next-intl';

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const animationStyle = {
  animation: `${fadeInUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
};

type MenuType = 'destinations' | 'interests' | null;

interface MegaMenuProps {
  activeMenu: MenuType;
  visible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void; 
}

export default function MegaMenu({ activeMenu, visible, onMouseEnter, onMouseLeave, onClose }: MegaMenuProps) {
  const t = useTranslations('Header'); 
  const tLoc = useTranslations('Locations'); // <--- 1. Hook for Locations
  const tInt = useTranslations('Interests'); // <--- 2. Hook for Interests
  const theme = useTheme();
  
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(0);

  const totalDestinations = NAV_DESTINATIONS.length;
  const maxPage = Math.ceil(totalDestinations / ITEMS_PER_PAGE) - 1;

  const handleNext = () => { if (page < maxPage) setPage(prev => prev + 1); };
  const handlePrev = () => { if (page > 0) setPage(prev => prev - 1); };

  const currentDestinations = NAV_DESTINATIONS.slice(
      page * ITEMS_PER_PAGE, 
      (page + 1) * ITEMS_PER_PAGE
  );

  if (!activeMenu) return null;

  return (
    <Fade in={visible} timeout={300}>
      <Paper
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        elevation={8}
        sx={{
          position: 'fixed',
          top: 80, 
          left: 0,
          right: 0,
          zIndex: 999,
          borderRadius: '0 0 24px 24px',
          overflow: 'hidden',
          bgcolor: theme.palette.background.paper, 
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 6 }}>
            
            {/* === 🌍 DESTINATIONS === */}
            {activeMenu === 'destinations' && (
                <Box sx={animationStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1.2 }}>
                            {t('menuDestinationsTitle')}
                        </Typography>
                        
                        {/* Pagination Controls */}
                        {totalDestinations > ITEMS_PER_PAGE && (
                            <Box>
                                <IconButton 
                                    onClick={handlePrev} 
                                    disabled={page === 0} 
                                    size="small" 
                                    sx={{ 
                                        mr: 1, 
                                        border: '1px solid', borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover:not(:disabled)': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                                    }}
                                >
                                    <ArrowBack fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    onClick={handleNext} 
                                    disabled={page === maxPage} 
                                    size="small" 
                                    sx={{ 
                                        border: '1px solid', borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover:not(:disabled)': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                                    }}
                                >
                                    <ArrowForward fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={3} key={page} sx={animationStyle}>
                        {currentDestinations.map((item) => (
                            <Grid key={item.id}  size={{xs: 12, sm: 6, md: 3}}>
                                <Link href={item.link} onClick={onClose} style={{ textDecoration: 'none' }}>
                                    <Box sx={{ 
                                        position: 'relative', height: 240, borderRadius: 4, overflow: 'hidden', boxShadow: 1,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
                                        '&:hover .overlay': { opacity: 0.3 }
                                    }}>
                                            <CardMedia 
                                                component="img" 
                                                image={item.image} 
                                                // ▼▼▼ LOCALIZED ALT TEXT using ID ▼▼▼
                                                alt={tLoc(`${item.id}.title`)} 
                                                sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                            />
                                            <Box className="overlay" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)', transition: 'opacity 0.4s ease' }} />
                                            <Box sx={{ position: 'absolute', bottom: 20, left: 20, pr: 2 }}>
                                                {/* ▼▼▼ LOCALIZED TITLE using ID ▼▼▼ */}
                                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                                    {tLoc(`${item.id}.title`)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mt: 0.5, display: 'block' }}>
                                                    {t('explore')}
                                                </Typography>
                                            </Box>
                                    </Box>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                    
                    <Box sx={{ mt: 4, textAlign: 'right' }}>
                        <Link href="/experiences" onClick={onClose} style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
                           <Typography component="span" sx={{ borderBottom: '2px solid transparent', transition: 'border-color 0.2s', '&:hover': { borderColor: 'primary.main' }}}>
                               {t('menuViewAll')}
                           </Typography>
                           <ArrowForwardIos sx={{ ml: 1, fontSize: 12, color: 'primary.main' }} />
                        </Link>
                    </Box>
                </Box>
            )}

            {/* === 🏄 INTERESTS === */}
            {activeMenu === 'interests' && (
                <Box sx={animationStyle}>
                    <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ mb: 3, display: 'block', letterSpacing: 1.2 }}>
                        {t('menuInterestsTitle')}
                    </Typography>
                    <Grid container spacing={3}>
                        {NAV_INTERESTS.map((item, index) => {
                           // @ts-expect-error: Dynamic icon access requires index signature
                            const IconComponent = MuiIcons[item.icon] || MuiIcons.HelpOutline;
                            return (
                                <Grid key={item.id}  size={{xs: 12, sm: 6, md: 3}}>
                                    <Link href={item.link} onClick={onClose} style={{ textDecoration: 'none' }}>
                                        <Card sx={{ 
                                            p: 3, height: '100%', display: 'flex', alignItems: 'flex-start', borderRadius: 4,
                                            border: '1px solid', borderColor: 'divider', boxShadow: 'none', bgcolor: 'transparent',
                                            animation: `${fadeInUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`, animationDelay: `${index * 0.05}s`, 
                                            opacity: 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': { borderColor: 'primary.main', bgcolor: 'background.paper', transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }
                                        }}>
                                            <Box sx={{ mr: 2.5, p: 1.5, bgcolor: 'primary.light', color: 'primary.main', borderRadius: '12px', display: 'flex' }}>
                                                <IconComponent fontSize="medium" />
                                            </Box>
                                            <Box>
                                                {/* ▼▼▼ LOCALIZED INTEREST TITLE & DESC using ID ▼▼▼ */}
                                                <Typography variant="subtitle1" fontWeight="800" color="text.primary">
                                                    {tInt(`${item.id}.title`)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mt: 0.5 }}>
                                                    {tInt(`${item.id}.description`)}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Link>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}

        </Box>
      </Paper>
    </Fade>
  );
}