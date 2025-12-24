'use client';

import React from 'react';
import { Box, Typography, Paper, Button, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslations } from 'next-intl';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CUSTOM MARKER ---
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 8px; height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16]
  });
};

interface TourMapProps {
  latitude?: number;
  longitude?: number;
}

export default function TourMap({ latitude, longitude }: TourMapProps) {
  const theme = useTheme();
  const t = useTranslations('ExperienceDetails.map'); //

  const hasValidCoordinates = latitude !== undefined && longitude !== undefined && latitude !== 0 && longitude !== 0;

  if (!hasValidCoordinates) return null;

  const position: [number, number] = [latitude!, longitude!];
  const customIcon = createCustomIcon(theme.palette.primary.main);

  const handleOpenGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
  };

  // 🎨 DARK MODE STRATEGY:
  // We switch the Tile URL based on the theme mode.
  // Light: CartoDB Voyager (Clean, colorful)
  // Dark:  CartoDB Dark Matter (High contrast dark mode)
  const isDark = theme.palette.mode === 'dark';
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper 
        elevation={2} 
        sx={{ 
          position: 'relative',
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          height: { xs: '350px', md: '450px' } // Responsive height
        }}
      >
        <MapContainer 
            center={position} 
            zoom={14} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%', zIndex: 1, background: isDark ? '#202020' : '#ddd' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url={tileUrl}
            />
            
            <Marker position={position} icon={customIcon}>
                <Popup className="custom-popup">
                    <Typography variant="subtitle2" fontWeight="bold">
                        {t('meetingPoint')}
                    </Typography>
                </Popup>
            </Marker>
        </MapContainer>

        {/* FLOATING CARD */}
        <Paper 
            elevation={3}
            sx={{ 
                position: 'absolute', 
                bottom: 20, 
                left: 20, 
                right: 20,
                width: { md: 'auto' },
                maxWidth: { md: 400 },
                p: 2,
                borderRadius: 3,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                zIndex: 1000,
                bgcolor: 'background.paper', // Auto adapts to dark mode
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <Box 
                    sx={{ 
                        width: 40, height: 40, 
                        borderRadius: '50%', 
                        // Subtle transparent background works on both dark/light
                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'primary.light', 
                        color: 'primary.main',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mr: 2, flexShrink: 0
                    }}
                >
                    <MapIcon />
                </Box>
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {t('meetingPoint')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        {t('getDirections')}
                    </Typography>
                </Box>
            </Box>

            <Button 
                variant="outlined" 
                size="small"
                onClick={handleOpenGoogleMaps}
                endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                sx={{ ml: 2, whiteSpace: 'nowrap', borderRadius: 10, textTransform: 'none', fontWeight: 'bold' }}
            >
                {t('openMaps')}
            </Button>
        </Paper>
      </Paper>
    </Box>
  );
}