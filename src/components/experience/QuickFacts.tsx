// /src/components/experience/QuickFacts.tsx
'use client';

import React from 'react';
import { Typography, Grid, Box, Stack, Avatar, useTheme } from '@mui/material';
// Import icons
import GroupIcon from '@mui/icons-material/Group';
import LanguageIcon from '@mui/icons-material/Translate';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// ▼▼▼ NEW IMPORT ▼▼▼
import { useTranslations } from 'next-intl';

// Define real props based on the Experience type
interface QuickFactsProps {
    maxGuests?: number;
    tourCode?: string;
    languages?: string[];
    startTimes?: string[];
}

export default function QuickFacts({ maxGuests, tourCode, languages, startTimes }: QuickFactsProps) {
  const theme = useTheme();
  // ▼▼▼ GET TRANSLATIONS ▼▼▼
  const t = useTranslations('ExperienceDetailsNew');

  // Global Check: If no data exists at all, don't render the component
  const hasAnyData = tourCode || maxGuests || (languages && languages.length > 0) || (startTimes && startTimes.length > 0);

  if (!hasAnyData) {
    return null;
  }

  // Shared styling for the icon avatars to ensure consistency
  const avatarStyle = {
    bgcolor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    width: 48,
    height: 48,
  };

  // Shared styling for the labels
  const labelStyle = {
    variant: "caption" as const,
    color: "text.secondary" as const,
    display: "block",
    mb: 0.5
  };

  // Shared styling for the data values
  const valueStyle = {
    variant: "body1" as const,
    fontWeight: 700
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
        {/* ▼▼▼ TRANSLATED ▼▼▼ */}
        {t('quickFactsTitle')}
      </Typography>

      <Grid container spacing={4}>
        {/* Fact 1: Tour Code - Only show if data exists */}
        {tourCode && (
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={avatarStyle}>
                    <ConfirmationNumberIcon />
                </Avatar>
                <Box>
                    {/* ▼▼▼ TRANSLATED ▼▼▼ */}
                    <Typography {...labelStyle}>{t('tourCodeLabel')}</Typography>
                    <Typography {...valueStyle}>{tourCode}</Typography>
                </Box>
            </Stack>
            </Grid>
        )}

        {/* Fact 2: Max Guests - Only show if data exists */}
        {maxGuests && (
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={avatarStyle}>
                    <GroupIcon />
                </Avatar>
                <Box>
                    {/* ▼▼▼ TRANSLATED ▼▼▼ */}
                    <Typography {...labelStyle}>{t('groupSizeLabel')}</Typography>
                    {/* ▼▼▼ TRANSLATED WITH VARIABLE ▼▼▼ */}
                    <Typography {...valueStyle}>{t('maxGuestsValue', { count: maxGuests })}</Typography>
                </Box>
            </Stack>
            </Grid>
        )}

        {/* Fact 3: Languages - Only show if array has items */}
        {languages && languages.length > 0 && (
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={avatarStyle}>
                    <LanguageIcon />
                </Avatar>
                <Box>
                    {/* ▼▼▼ TRANSLATED ▼▼▼ */}
                    <Typography {...labelStyle}>{t('languagesLabel')}</Typography>
                    {/* Join the array into a string */}
                    <Typography {...valueStyle}>{languages.join(', ')}</Typography>
                </Box>
            </Stack>
            </Grid>
        )}

        {/* Fact 4: Start Times - Only show if array has items */}
        {startTimes && startTimes.length > 0 && (
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={avatarStyle}>
                    <ScheduleIcon />
                </Avatar>
                <Box>
                    {/* ▼▼▼ TRANSLATED ▼▼▼ */}
                    <Typography {...labelStyle}>{t('dailyDeparturesLabel')}</Typography>
                    {/* Join the array into a string */}
                    <Typography {...valueStyle}>{startTimes.join(', ')}</Typography>
                </Box>
                </Stack>
            </Grid>
        )}
      </Grid>
    </Box>
  );
}