// /src/components/experience/TourMap.tsx
'use client';

import React from 'react';
import { Box, Typography, Paper, Button, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslations } from 'next-intl';
// ▼▼▼ LEAFLET IMPORTS ▼▼▼
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in Next.js / Webpack
// Without this, the marker icon will be broken.
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;
// ▲▲▲ END LEAFLET FIX ▲▲▲

interface TourMapProps {
  latitude?: number;
  longitude?: number;
}

export default function TourMap({ latitude, longitude }: TourMapProps) {
  const theme = useTheme();
  const t = useTranslations('ExperienceDetailsNew');

  // 1. Check for valid coordinates. If missing or 0, don't render the map.
  const hasValidCoordinates = latitude !== undefined && longitude !== undefined && latitude !== 0 && longitude !== 0;

  if (!hasValidCoordinates) {
    return null;
  }

  const position: [number, number] = [latitude, longitude];

  const handleOpenGoogleMaps = () => {
    // Open location in Google Maps in a new tab
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
  };

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        {t('tourMapTitle')}
      </Typography>
      
      <Paper 
        elevation={2} 
        sx={{ 
          position: 'relative',
          borderRadius: 3, 
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          height: '400px' // Fixed height for the map container
        }}
      >
        {/* ▼▼▼ THE REACT LEAFLET MAP ▼▼▼ */}
        <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
            {/* OpenStreetMap Tiles (Free & reliable) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Meeting Point Marker */}
            <Marker position={position}>
                <Popup>
                    {t('meetingPointLabel')}
                </Popup>
            </Marker>
        </MapContainer>
        {/* ▲▲▲ END MAP ▲▲▲ */}

        {/* Overlay Info & Button */}
        <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '100%', 
            p: 2,
            // Add a subtle gradient background to make text readable over the map
            background: 'linear-gradient(to top, rgba(255,255,255,0.95) 60%, rgba(255,255,255,0) 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            zIndex: 2 // Ensure it sits on top of the map
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MapIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                        {t('meetingPointLabel')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {/* Show coordinates as a fallback descriptor */}
                        {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </Typography>
                </Box>
            </Box>

            <Button 
                variant="contained" 
                color="primary"
                endIcon={<OpenInNewIcon />}
                sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: theme.shadows[2]
                }}
                onClick={handleOpenGoogleMaps}
            >
                {t('viewOnMapsButton')}
            </Button>
        </Box>
      </Paper>
    </Box>
  );
}