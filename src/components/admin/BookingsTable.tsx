// src/components/admin/BookingsTable.tsx
'use client';

import React, { useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Chip, IconButton, Menu, MenuItem, Stack, Tooltip, 
  useTheme, useMediaQuery, Card, Box, Divider 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NoteIcon from '@mui/icons-material/Note';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import PeopleIcon from '@mui/icons-material/People'; 
import { useAppRouter } from '@/hooks/router/useAppRouter';
import { useTranslations } from 'next-intl';

interface Booking {
  id: string;
  experienceTitle: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  guests?: {
    adults: number;
    children: number;
    total: number;
  };
  notes?: string;
  customerName?: string;
  customerEmail?: string;
  requestedDate?: string;
  numberOfGuests?: number;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
  const t = useTranslations('admin.AdminBookingsTable');
  const router = useAppRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, bookingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookingId(bookingId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedBookingId(null);
  };

  const handleStatusChange = async (newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    if (!selectedBookingId) return;

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      handleClose();
      router.refresh();

    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert('Error: Could not update status.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Localized Status Chips
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Chip label={t('status.confirmed')} color="success" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'cancelled':
        return <Chip label={t('status.cancelled')} color="error" size="small" sx={{ fontWeight: 'bold' }} />;
      default:
        return <Chip label={t('status.pending')} color="warning" size="small" sx={{ fontWeight: 'bold' }} />;
    }
  };

  // --- MOBILE CARD RENDERER ---
  const renderMobileCard = (row: Booking) => {
      const name = row.customer?.name || row.customerName || 'Unknown';
      const email = row.customer?.email || row.customerEmail || 'N/A';
      const phone = row.customer?.phone;
      const totalGuests = row.guests?.total ?? row.numberOfGuests ?? 0;
      const dateToUse = row.bookingDate || row.requestedDate;

      return (
        <Card 
          key={row.id} 
          sx={{ 
            bgcolor: 'background.paper', // Replaced #1a1a1a
            color: 'text.primary',       // Replaced 'white'
            border: 1,
            borderColor: 'divider',      // Replaced '1px solid rgba...'
            borderRadius: 2, 
            mb: 2, 
            overflow: 'visible' 
          }}
        >
            <Box sx={{ p: 2 }}>
                {/* Header: Name + Status + Menu */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{email}</Typography> {/* Replaced text.secondary (was already good but double checking) */}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        {getStatusChip(row.status)}
                        <IconButton 
                            size="small" 
                            onClick={(e) => handleClick(e, row.id)}
                            sx={{ color: 'text.secondary', m: -1, mt: 0 }} // Replaced rgba(255,255,255,0.5)
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} /> {/* Standard Divider uses theme colors */}

                {/* Details Grid */}
                <Stack spacing={1.5}>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                            {t('headers.experience')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.experienceTitle}</Typography>
                    </Box>

                    <Stack direction="row" spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {/* Replaced #D97706 with primary.main */}
                            <CalendarTodayIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="body2">{formatDate(dateToUse)}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                             {/* Replaced #D97706 with primary.main */}
                            <PeopleIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="body2">{totalGuests} {t('headers.guests')}</Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Footer: WhatsApp */}
                {phone && (
                   <Box sx={{ mt: 2, pt: 1.5, borderTop: 1, borderColor: 'divider' }}> {/* Replaced manual border */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WhatsAppIcon fontSize="small" color="success" />
                            <Typography 
                                variant="body2" 
                                component="a" 
                                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'success.main', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                {t('actions.chatWhatsApp')}
                            </Typography>
                        </Stack>
                   </Box>
                )}
            </Box>
        </Card>
      );
  };

  // --- MAIN RENDER ---
  return (
    <>
      {bookings.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            {t('noBookings')}
          </Typography>
      ) : (
        <>
            {/* MOBILE VIEW */}
            {isMobile ? (
                <Stack spacing={0}>
                    {bookings.map((row) => renderMobileCard(row))}
                </Stack>
            ) : (
            /* DESKTOP VIEW */
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                <Table sx={{ minWidth: 750 }} aria-label="bookings table">
                <TableHead>
                    <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.customer')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.experience')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.date')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.guests')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.status')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('headers.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings.map((row) => {
                    const name = row.customer?.name || row.customerName || 'Unknown';
                    const email = row.customer?.email || row.customerEmail || 'N/A';
                    const phone = row.customer?.phone;
                    const totalGuests = row.guests?.total ?? row.numberOfGuests ?? 0;
                    const dateToUse = row.bookingDate || row.requestedDate;

                    return (
                        <TableRow key={row.id} hover>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{name}</Typography>
                            {row.notes && (
                                <Tooltip title={<Typography variant="body2">{row.notes}</Typography>} arrow placement="top">
                                <NoteIcon color="action" fontSize="small" sx={{ cursor: 'help' }}/>
                                </Tooltip>
                            )}
                            </Stack>
                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>{email}</Typography>
                        </TableCell>
                        <TableCell>{row.experienceTitle}</TableCell>
                        <TableCell>{formatDate(dateToUse)}</TableCell>
                        <TableCell>
                            <Typography variant="body2">{totalGuests} {t('headers.guests')}</Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(row.status)}</TableCell>
                        <TableCell align="right">
                            <IconButton
                            aria-label="more"
                            onClick={(e) => handleClick(e, row.id)}
                            >
                            <MoreVertIcon />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            )}
        </>
      )}
      
      {/* Menu for Actions */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleStatusChange('confirmed')}>{t('actions.markConfirmed')}</MenuItem>
        <MenuItem onClick={() => handleStatusChange('pending')}>{t('actions.markPending')}</MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>{t('actions.markCancelled')}</MenuItem>
      </Menu>
    </>
  );
}