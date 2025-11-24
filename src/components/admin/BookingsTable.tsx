// /src/components/admin/BookingsTable.tsx
'use client';

import React, { useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Chip, IconButton, Menu, MenuItem, Stack, Tooltip 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NoteIcon from '@mui/icons-material/Note';
import { useAppRouter } from '@/hooks/router/useAppRouter';

// Defines the structure of a Booking object as returned by the Admin API.
// It must accommodate both old and new data structures.
interface Booking {
  id: string;
  experienceTitle: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  
  // New standardized date field from API
  bookingDate?: string;

  // New Nested Objects
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

  // Legacy fields (for old records)
  customerName?: string;
  customerEmail?: string;
  requestedDate?: string;
  numberOfGuests?: number;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useAppRouter();
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

  // Helper to format dates safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      // Use UTC to avoid timezone shifts on the server date
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' 
      });
    } catch (e) {
      return e instanceof Error ? e.message : 'Invalid date';
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Chip label="Confirmed" color="success" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table sx={{ minWidth: 750 }} aria-label="bookings table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Experience</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Booked For</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Guests</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((row) => {
              // --- Data Normalization (Handle Old vs New) ---
              const name = row.customer?.name || row.customerName || 'Unknown';
              const email = row.customer?.email || row.customerEmail || 'N/A';
              const phone = row.customer?.phone;
              const totalGuests = row.guests?.total ?? row.numberOfGuests ?? 0;
              const adults = row.guests?.adults;
              const children = row.guests?.children;
              const dateToUse = row.bookingDate || row.requestedDate;
              // ----------------------------------------------

              return (
                <TableRow key={row.id} hover>
                  {/* CUSTOMER COLUMN */}
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{name}</Typography>
                      {/* Show note icon if notes exist */}
                      {row.notes && (
                        <Tooltip title={<Typography variant="body2">{row.notes}</Typography>} arrow placement="top">
                          <NoteIcon color="action" fontSize="small" sx={{ cursor: 'help' }}/>
                        </Tooltip>
                      )}
                    </Stack>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>{email}</Typography>
                    {phone && (
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                        <WhatsAppIcon fontSize="inherit" color="success" />
                        <Typography 
                          variant="caption" 
                          component="a" 
                          // Clean phone number for WhatsApp link (remove spaces, +, etc.)
                          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: 'success.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          {phone}
                        </Typography>
                      </Stack>
                    )}
                  </TableCell>

                  {/* EXPERIENCE COLUMN */}
                  <TableCell>{row.experienceTitle}</TableCell>

                  {/* DATE COLUMN */}
                  <TableCell>{formatDate(dateToUse)}</TableCell>

                  {/* GUESTS COLUMN */}
                  <TableCell>
                    <Typography variant="body2">{totalGuests} Guests</Typography>
                    {adults !== undefined && children !== undefined && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        ({adults} Adults, {children} Children)
                      </Typography>
                    )}
                  </TableCell>

                  {/* STATUS COLUMN */}
                  <TableCell>{getStatusChip(row.status)}</TableCell>

                  {/* ACTIONS COLUMN */}
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
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleStatusChange('confirmed')}>Mark as Confirmed</MenuItem>
        <MenuItem onClick={() => handleStatusChange('pending')}>Mark as Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>Mark as Cancelled</MenuItem>
      </Menu>
    </>
  );
}