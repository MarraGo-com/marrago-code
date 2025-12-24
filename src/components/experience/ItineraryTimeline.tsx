'use client';

import React from 'react';
import { Box, Typography, Stack, Chip, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'; 
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CircleIcon from '@mui/icons-material/Circle';
import { TimelineStep } from '@/types/experience';
import { useTranslations } from 'next-intl'; // <--- Import Hook

interface ItineraryTimelineProps {
  steps: TimelineStep[];
}

export default function ItineraryTimeline({ steps }: ItineraryTimelineProps) {
  const theme = useTheme();
  const t = useTranslations('ExperienceDetails.timeline'); // <--- Initialize

  // Helper to choose the right icon
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'transport': return <DirectionsBusIcon fontSize="small" sx={{ color: 'white' }} />;
      case 'passBy': return <VisibilityIcon fontSize="small" sx={{ color: 'white' }} />;
      case 'admission': return <ConfirmationNumberIcon fontSize="small" sx={{ color: 'white' }} />;
      case 'stop': default: return <LocationOnIcon fontSize="small" sx={{ color: 'white' }} />;
    }
  };

  // Helper for color coding the step
  const getStepColor = (type: string) => {
    switch (type) {
      case 'transport': return theme.palette.info.main;
      case 'passBy': return theme.palette.grey[500];
      case 'admission': return theme.palette.secondary.main;
      case 'stop': default: return theme.palette.primary.main;
    }
  };

  if (!steps || steps.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        {t('title')} {/* <--- Localized Title */}
      </Typography>

      <Box sx={{ position: 'relative', ml: 1 }}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const color = getStepColor(step.type);

          return (
            <Box key={index} sx={{ position: 'relative', pb: isLast ? 0 : 4, pl: 4 }}>
              
              {/* 1. VERTICAL LINE */}
              {!isLast && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: 15, 
                    top: 35, 
                    bottom: 0, 
                    width: 2, 
                    bgcolor: theme.palette.divider 
                  }} 
                />
              )}

              {/* 2. THE ICON BUBBLE */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: 0, 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  bgcolor: color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {getStepIcon(step.type)}
              </Box>

              {/* 3. CONTENT BLOCK */}
              <Box sx={{ pt: 0.5 }}>
                
                {/* Title & Badge */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {step.title}
                  </Typography>
                  
                  {/* Localized Chips */}
                  {step.admission === 'included' && (
                    <Chip 
                      label={t('ticketIncluded')} // <--- Localized
                      size="small" 
                      color="success" 
                      variant="outlined" 
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} 
                    />
                  )}
                   {step.admission === 'free' && (
                    <Chip 
                      label={t('freeAdmission')} // <--- Localized
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        bgcolor: theme.palette.grey[100],
                        color: '#000000' 
                      }} 
                    />
                  )}
                </Stack>

                {/* Duration & Type */}
                <Stack direction="row" spacing={2} sx={{ mb: 1, color: 'text.secondary' }}>
                    {step.duration && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight="bold">{step.duration}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CircleIcon sx={{ fontSize: 6, color: color }} />
                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                            {/* DYNAMIC LOCALIZATION FOR STEP TYPE */}
                            {/* This looks up 'types.stop', 'types.passBy', etc. */}
                            {t(`types.${step.type}` as any)}
                        </Typography>
                    </Box>
                </Stack>

                {/* Description */}
                {step.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}