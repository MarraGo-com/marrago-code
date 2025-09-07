// /src/themes/luxury/ui/SearchBar.tsx
'use client';

import React from 'react';
import { Box, TextField, Button, InputAdornment, MenuItem , useTheme, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
// A helper component for the "Label Above" style, now with smaller font size
/* const LabeledInput = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <Box>
        <Typography 
            variant="caption" 
            sx={{ 
                color: 'text.secondary', 
                fontWeight: 600, // Bolder font for better readability
                fontSize: '0.65rem', // Smaller font size for the label
                textTransform: 'uppercase', 
                display: 'block', 
                mb: 0.5 
            }}
        >
            {label}
        </Typography>
        {children}
    </Box>
); */

export default function SearchBar() {
  // Use real hook if it exists, otherwise fall back to mock
  const t = useTranslations('SearchBar');
  const theme = useTheme();

  const bgColor = theme.palette.mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.5)'
    : 'rgba(255, 255, 255, 0.5)';

  const compactFieldStyles = {
    '& .MuiInputBase-root': {
      fontSize: '0.8rem', 
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.8rem', 
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1rem', 
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        py: 2,
      }}
    >
      <Box 
        sx={{ 
          width: { xs: '95%', md: 'auto' },
          backgroundColor: bgColor,
         // backdropFilter: 'blur(8px)',
         // WebkitBackdropFilter: 'blur(8px)',
          p: 1, // Reduced padding
          borderRadius: 25,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5, // Adjusted gap
          overflowX: 'auto',
        }}
      >
        <TextField
          variant="standard"
          size="small"
          placeholder={t('destinationPlaceholder')}
          sx={{ ...compactFieldStyles, minWidth: '180px', pl: 1 }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon sx={compactFieldStyles['& .MuiSvgIcon-root']} /></InputAdornment>),
            disableUnderline: true,
          }}
        />
        <Divider orientation="vertical" flexItem />
        <TextField
          variant="standard"
          size="small"
          label={t('checkInLabel')}
          sx={{ ...compactFieldStyles, minWidth: '110px' }}
          InputProps={{
            endAdornment: (<InputAdornment position="end"><CalendarMonthIcon sx={compactFieldStyles['& .MuiSvgIcon-root']} /></InputAdornment>),
            disableUnderline: true,
          }}
        />
        <TextField
          variant="standard"
          size="small"
          label={t('checkOutLabel')}
          sx={{ ...compactFieldStyles, minWidth: '110px' }}
          InputProps={{
            endAdornment: (<InputAdornment position="end"><CalendarMonthIcon sx={compactFieldStyles['& .MuiSvgIcon-root']} /></InputAdornment>),
            disableUnderline: true,
          }}
        />
        <Divider orientation="vertical" flexItem />
        <TextField
          select
          variant="standard"
          size="small"
          label={t('roomsLabel')}
          defaultValue="1"
          sx={{ ...compactFieldStyles, minWidth: '90px' }}
          InputProps={{ disableUnderline: true }}
        >
          <MenuItem value="1">1 Room</MenuItem>
          <MenuItem value="2">2 Rooms</MenuItem>
        </TextField>
        <TextField
          select
          variant="standard"
          size="small"
          label={t('adultsLabel')}
          defaultValue="2"
          sx={{ ...compactFieldStyles, minWidth: '90px' }}
          InputProps={{ disableUnderline: true }}
        >
          <MenuItem value="1">1 Adult</MenuItem>
          <MenuItem value="2">2 Adults</MenuItem>
        </TextField>
        <TextField
          select
          variant="standard"
          size="small"
          label={t('childrenLabel')}
          defaultValue="0"
          sx={{ ...compactFieldStyles, minWidth: '95px' }}
          InputProps={{ disableUnderline: true }}
        >
          <MenuItem value="0">0 Children</MenuItem>
          <MenuItem value="1">1 Child</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          sx={{ 
            height: '40px', 
            borderRadius: '20px', 
            fontSize: '0.8rem',
            minWidth: '100px',
            mr: 0.5
          }}
        >
          {t('searchButton')}
        </Button>
      </Box>
    </Box>
  );
}