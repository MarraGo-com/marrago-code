'use client';

import React from 'react';
import { Typography, Box, Stack, Avatar, useTheme, alpha, Grid } from '@mui/material';
// Import icons
import GroupIcon from '@mui/icons-material/Group';
import LanguageIcon from '@mui/icons-material/Translate';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Added for Duration
import { useTranslations } from 'next-intl';

// Import strict types
import { DurationUnit, LanguageCode } from '@/types/experience';

interface QuickFactsProps {
  maxGuests?: number;
  tourCode?: string;
  // UPDATED: Now accepts strict codes instead of loose strings
  languages?: LanguageCode[]; 
  startTimes?: string[];
  // NEW: Duration split into value/unit
  durationValue?: number;
  durationUnit?: DurationUnit;
}

export default function QuickFacts({ 
  maxGuests, 
  tourCode, 
  languages, 
  startTimes,
  durationValue,
  durationUnit 
}: QuickFactsProps) {
  const theme = useTheme();
  
  // 1. Load Translations
  const t = useTranslations('ExperienceDetails.quickFacts');
  const tCommon = useTranslations('Common');

  // Global Check: If no data exists, don't render
  const hasAnyData = tourCode || maxGuests || (languages && languages.length > 0) || (startTimes && startTimes.length > 0) || durationValue;

  if (!hasAnyData) {
    return null;
  }

  // --- STYLES (Preserved exactly as you had them) ---
  const avatarStyle = {
    bgcolor: alpha(theme.palette.primary.main, 0.1), 
    color: theme.palette.primary.main, 
    width: 48,
    height: 48,
  };

  const labelStyle = {
    variant: "caption" as const,
    color: "text.secondary" as const,
    display: "block",
    mb: 0.5,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5
  };

  const valueStyle = {
    variant: "body1" as const,
    fontWeight: 700,
    color: "text.primary" as const
  };

  // --- LOGIC: Dynamic Formatting ---

  // 1. Duration: "6" + "Hours" (Localized)
  const formattedDuration = durationValue && durationUnit 
    ? `${durationValue} ${tCommon(`units.${durationUnit}`, { count: durationValue })}`
    : null;

  // 2. Languages: ['en', 'fr'] -> "English, French" (Localized)
  const formattedLanguages = languages && languages.length > 0
    ? languages.map(code => tCommon(`languages.${code}`)).join(', ')
    : null;

  // 3. Guests: "10" + "People" (Localized)
  const formattedGuests = maxGuests
    ? `${maxGuests} ${t('people', { count: maxGuests })}`
    : null;

  return (
    <Box>
      <Grid container spacing={4}>
        
        {/* Fact 1: Duration (NEW - Added this standard field) */}
        {formattedDuration && (
            <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={avatarStyle}>
                        <AccessTimeIcon />
                    </Avatar>
                    <Box>
                        <Typography {...labelStyle}>{t('duration')}</Typography>
                        <Typography {...valueStyle}>{formattedDuration}</Typography>
                    </Box>
                </Stack>
            </Grid>
        )}

        {/* Fact 2: Max Guests */}
        {formattedGuests && (
            <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={avatarStyle}>
                        <GroupIcon />
                    </Avatar>
                    <Box>
                         {/* Uses 'maxGuests' key from JSON */}
                        <Typography {...labelStyle}>{t('maxGuests')}</Typography>
                        <Typography {...valueStyle}>{formattedGuests}</Typography>
                    </Box>
                </Stack>
            </Grid>
        )}

        {/* Fact 3: Languages */}
        {formattedLanguages && (
            <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={avatarStyle}>
                        <LanguageIcon />
                    </Avatar>
                    <Box>
                        <Typography {...labelStyle}>{t('languages')}</Typography>
                        <Typography {...valueStyle}>{formattedLanguages}</Typography>
                    </Box>
                </Stack>
            </Grid>
        )}

        {/* Fact 4: Start Times */}
        {startTimes && startTimes.length > 0 && (
            <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={avatarStyle}>
                        <ScheduleIcon />
                    </Avatar>
                    <Box>
                        {/* FIX: Use translation key */}
                        <Typography {...labelStyle}>{t('startTime')}</Typography>
                        <Typography {...valueStyle}>{startTimes.join(', ')}</Typography>
                    </Box>
                </Stack>
            </Grid>
        )}

        {/* Fact 5: Tour Code */}
        {tourCode && (
            <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={avatarStyle}>
                        <ConfirmationNumberIcon />
                    </Avatar>
                    <Box>
                        {/* FIX: Use translation key */}
                        <Typography {...labelStyle}>{t('tourCode')}</Typography>
                        <Typography {...valueStyle}>{tourCode}</Typography>
                    </Box>
                </Stack>
            </Grid>
        )}
      </Grid>
    </Box>
  );
}