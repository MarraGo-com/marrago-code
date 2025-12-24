'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Paper, Button, useTheme, Stack, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Experience } from '@/types/experience';

// --- 1. CUSTOM ICON ---
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px; height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16]
  });
};

// --- 2. MAP CONTROLLER ---
function MapController({ experiences, isVisible }: { experiences: Experience[]; isVisible: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!isVisible) return;

    // Kick 1: Immediate
    map.invalidateSize();

    // Kick 2: After 100ms (React Render)
    const t1 = setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Kick 3: After 500ms (CSS Animations)
    const t2 = setTimeout(() => {
        map.invalidateSize();
        
        // Only fit bounds if we have data
        if (experiences.length > 0) {
            const validPoints = experiences
                .filter(e => e.latitude && e.longitude)
                .map(e => [e.latitude!, e.longitude!] as [number, number]);

            if (validPoints.length > 0) {
                const bounds = L.latLngBounds(validPoints);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, 500);

    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
    };
  }, [experiences, isVisible, map]);

  return null;
}

interface SearchMapProps {
  experiences: Experience[];
  isVisible?: boolean;
}

export default function SearchMap({ experiences, isVisible = true }: SearchMapProps) {
  const theme = useTheme();
  const customIcon = createCustomIcon(theme.palette.primary.main);

  const validExperiences = experiences.filter(e => e.latitude && e.longitude);
  const defaultCenter: [number, number] = [31.6295, -7.9811]; 

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          position: 'relative',
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          height: '650px', 
          width: '100%'
        }}
      >
        <MapContainer 
            center={defaultCenter} 
            zoom={12} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapController experiences={validExperiences} isVisible={isVisible} />

            {validExperiences.map((exp) => (
                <Marker 
                    key={exp.id} 
                    position={[exp.latitude!, exp.longitude!]} 
                    icon={customIcon}
                >
                    <Popup className="search-map-popup" minWidth={280}>
                        <Box sx={{ p: 0 }}>
                            <Box 
                                component="img" 
                                src={exp.coverImage} 
                                alt="Cover" 
                                sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '8px 8px 0 0', display: 'block' }} 
                            />
                            <Box sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                        {exp.translations?.en?.title}
                                    </Typography>
                                    <Chip label={`${exp.price.amount}€`} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} />
                                </Stack>
                                
                                {/* ▼▼▼ FIX: Use new numeric duration fields ▼▼▼ */}
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                    {exp.durationValue} {exp.durationUnit} • {exp.reviewCount || 0} reviews
                                </Typography>
                                {/* ▲▲▲ */}

                                <Button 
                                    component={Link} 
                                    href={`/experiences/${exp.id}`}
                                    variant="outlined" 
                                    fullWidth 
                                    size="small"
                                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                                    sx={{ textTransform: 'none', borderRadius: 20, fontSize: '0.8rem' }}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Box>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
      </Paper>
    </Box>
  );
}