// /src/components/booking/BookingForm.tsx
'use client';

import React, { useState } from 'react';
import { 
    Paper, Typography, Box, Button, Stack, Divider, 
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    TextField, Alert, useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useTranslations } from 'next-intl';
import dayjs, { Dayjs } from 'dayjs';

// Import our new reusable component
import GuestCounter from './GuestCounter';

interface BookingFormProps {
  experienceId: string;
  experienceTitle: string;
  price: { amount: number; currency: string; prefix: string; };
  maxGuests?: number;
}

export default function BookingForm({ experienceId, experienceTitle, price, maxGuests = 15 }: BookingFormProps) {
  const theme = useTheme();
  const t = useTranslations('BookingForm');

  // Form State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  // Split guests into adults and children
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  // Modal State
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // New fields for modal
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Submission State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalGuests = adults + children;

  const handleOpen = () => {
    setError(null);
    if (!selectedDate) {
        setError(t('errorNoDate'));
        return;
    }
    if (totalGuests === 0) {
        setError(t('errorNoGuests'));
        return;
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    // Basic validation for required fields
    if (!name || !email || !phone) {
        setError(t('errorInvalidInput'));
        return;
    }
    
    setLoading(true);
    setError(null);

    const bookingData = {
      experienceId,
      experienceTitle,
      date: selectedDate?.format('YYYY-MM-DD'),
      adults,
      children,
      totalGuests,
      customer: { name, email, phone },
      notes,
      status: 'pending' // Initial status for a request
    };

    console.log("Sending booking request:", bookingData);

    // ▼▼▼ REAL API CALL ▼▼▼
    try {
      // Send POST request to our updated API route
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        // Try to get the error message from the server
        let errorMessage = 'Failed to submit';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            return e instanceof Error ? e.message : 'Failed to submit';

        }
        throw new Error(errorMessage);
      }
      
      // On success
      setSuccess(true);
      setOpen(false);
      // Reset form
      setName(''); setEmail(''); setPhone(''); setNotes('');
      setSelectedDate(null); setAdults(1); setChildren(0);

    } catch (err: unknown) {
      console.error("Booking submission error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errorGeneric'));
      }
    } finally {
      setLoading(false);
    }
    // ▲▲▲ END API CALL ▲▲▲
  };

  // Small helper component for trust signals
  const TrustSignal = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ color: 'success.main' }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {text}
      </Typography>
    </Stack>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
       {/* Price Display */}
      <Box sx={{ mb: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
              {price.prefix} {price.amount} {price.currency}
          </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{t('successMessage')}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Date Selection */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{t('dateLabel')}</Typography>
      <DatePicker
        value={selectedDate ? selectedDate.toDate() : null}
        onChange={(newValue) => setSelectedDate(newValue ? dayjs(newValue) : null)}
        disablePast
        slots={{ openPickerIcon: CalendarMonthIcon }}
        slotProps={{
            textField: {
                fullWidth: true,
                variant: 'outlined',
                sx: { mb: 3, bgcolor: 'background.default' }
            }
        }}
      />

      {/* Guest Selection using counters */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{t('guestsLabel')}</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <GuestCounter 
              label={t('adultsLabel')} 
              subLabel={t('adultsAge')} 
              value={adults} 
              onChange={setAdults} 
              min={1} // Require at least 1 adult
              max={maxGuests - children}
          />
          <Divider sx={{ my: 1 }} />
          <GuestCounter 
              label={t('childrenLabel')} 
              subLabel={t('childrenAge')}
              value={children} 
              onChange={setChildren} 
              min={0}
              max={maxGuests - adults}
          />
      </Paper>

      {/* Main Action Button */}
      <Button 
        variant="contained" 
        fullWidth 
        size="large"
        onClick={handleOpen}
        sx={{ 
            py: 1.5, 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            borderRadius: 2,
            boxShadow: theme.shadows[4]
        }}
      >
        {t('bookNowButton')}
      </Button>

      {/* Trust Signals */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, px: 1 }}>
          <TrustSignal icon={<VerifiedUserIcon fontSize="small" />} text={t('trustSignal1')} />
          <TrustSignal icon={<PriceCheckIcon fontSize="small" />} text={t('trustSignal2')} />
          <TrustSignal icon={<EventAvailableIcon fontSize="small" />} text={t('trustSignal3')} />
      </Stack>


      {/* Contact Info Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{t('dialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
             {t('dialogSubtitle', { experienceTitle, date: selectedDate?.format('MMMM D, YYYY') ?? '' })}
          </DialogContentText>
          
          {/* Summary of Selection */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default', display: 'flex', justifyContent: 'space-between' }}>
             <Box>
                <Typography variant="caption" display="block" color="text.secondary">{t('dateLabel')}</Typography>
                <Typography variant="body2" fontWeight="bold">{selectedDate?.format('MMM D, YYYY')}</Typography>
             </Box>
             <Box>
                <Typography variant="caption" display="block" color="text.secondary">{t('guestsLabel')}</Typography>
                <Typography variant="body2" fontWeight="bold">
                    {adults} {t('adultsLabel')}, {children} {t('childrenLabel')}
                </Typography>
             </Box>
          </Paper>

          <Stack spacing={2}>
            <TextField required label={t('nameLabel')} fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            <TextField required label={t('emailLabel')} type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            {/* NEW FIELDS */}
            <TextField required label={t('phoneLabel')} type="tel" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} helperText="Important for coordination via WhatsApp." />
            <TextField label={t('notesLabel')} multiline rows={3} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notesPlaceholder')} />
          </Stack>

        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">{t('cancelButton')}</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} size="large">
            {loading ? 'Sending...' : t('submitButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}