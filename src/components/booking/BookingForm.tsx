'use client';

import React, { useState } from 'react';
import { 
  Paper, Typography, Box, Button, Stack, Divider, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, Alert, useTheme, Fade
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import BoltIcon from '@mui/icons-material/Bolt'; 
import WhatshotIcon from '@mui/icons-material/Whatshot'; 

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';

import GuestCounter from './GuestCounter';
import { getCancellationDeadline } from '../../../utils/booking-utils';

interface BookingPolicy {
  cancellationHours: number;
  isPayLater?: boolean;
  instantConfirmation?: boolean;
}

interface BookingFormProps {
  experienceId: string;
  experienceTitle: string;
  price: { amount: number; currency: string; prefix: string; };
  maxGuests?: number;
  bookingPolicy?: BookingPolicy;
  spotsLeft?: number;      
  isMobileModal?: boolean; 
}

export default function BookingForm({ 
  experienceId, 
  experienceTitle, 
  price, 
  maxGuests = 15,
  bookingPolicy = { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
  spotsLeft,          
  isMobileModal = false 
}: BookingFormProps) {
  
  const theme = useTheme();
  const t = useTranslations('ExperienceDetails'); 
  const router = useRouter();
  const locale = useLocale();

  // Form State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  // Modal State
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalGuests = adults + children;

  // --- Scarcity Logic ---
  const showScarcity = spotsLeft !== undefined && spotsLeft < 10;

  const handleOpen = () => {
    setError(null);
    if (!selectedDate) {
        setError(t('booking.unavailable')); 
        return;
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
        setError(t('booking.errorRequired')); // Ensure this key exists or fallback
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
      status: bookingPolicy.instantConfirmation ? 'confirmed' : 'pending' // Smart Status
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setOpen(false);
      
      const params = new URLSearchParams({
        name: name,
        tour: experienceTitle
      });

      router.push(`/${locale}/booking-confirmation?${params.toString()}`);

    } catch (err: any) {
      console.error("Booking submission error:", err);
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper 
        elevation={isMobileModal ? 0 : 0} 
        sx={{ 
          p: isMobileModal ? 0 : 3, 
          borderRadius: 3, 
          border: isMobileModal ? 'none' : '1px solid',
          borderColor: 'divider',
          boxShadow: isMobileModal ? 'none' : theme.shadows[3],
          bgcolor: 'background.paper' 
        }}
      >
        
        {/* PRICE HEADER */}
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.5 }}>
                {t('stickyHeader.from')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800, fontSize: '28px' }}>
                    {price.prefix} {price.amount} {price.currency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('mobileBar.perPerson')}
                </Typography>
            </Box>
        </Box>

        {/* TRUST SIGNALS */}
        <Stack spacing={1} sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="flex-start" spacing={1}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 18, mt: 0.2 }} />
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {t('quickFacts.cancellation')}
                    </Typography>
                    {/* ▼▼▼ LOCALIZED CANCELLATION TEXT ▼▼▼ */}
                    {selectedDate ? (
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, display: 'block', lineHeight: 1.2, mt: 0.5 }}>
                            {t('booking.cancellationPolicy.beforeDate', { 
                                date: getCancellationDeadline(selectedDate, bookingPolicy.cancellationHours) 
                            })}
                        </Typography>
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            {t('booking.cancellationPolicy.upToHours', { hours: bookingPolicy.cancellationHours })}
                        </Typography>
                    )}
                </Box>
            </Stack>

            {bookingPolicy.isPayLater && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <BoltIcon sx={{ color: '#fdb022', fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        {t('booking.reserveNowPayLater')}
                    </Typography>
                </Stack>
            )}
        </Stack>

        {/* SCARCITY WARNING (Localized) */}
        {showScarcity && (
            <Fade in={true}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, p: 1.5, bgcolor: '#fff4e5', borderRadius: 2, border: '1px solid #ffcc80' }}>
                    <WhatshotIcon color="error" fontSize="small" />
                    <Typography variant="body2" color="error.main" fontWeight="bold">
                        {t('booking.scarcityWarning', { count: spotsLeft })}
                    </Typography>
                </Stack>
            </Fade>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* INPUTS */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, fontSize: '0.9rem' }}>
            {t('booking.selectDate')}
        </Typography>
        <DatePicker
            value={selectedDate ? selectedDate.toDate() : null}
            onChange={(newValue) => setSelectedDate(newValue ? dayjs(newValue) : null)}
            disablePast
            slots={{ openPickerIcon: CalendarMonthIcon }}
            slotProps={{
                textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: { mb: 2, bgcolor: 'background.default' } 
                }
            }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, fontSize: '0.9rem' }}>
            {t('booking.guests')}
        </Typography>
        <Paper 
            variant="outlined" 
            sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: 'action.hover', 
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <GuestCounter 
                label={t('booking.adults')} 
                subLabel="Age 13+" 
                value={adults} 
                onChange={setAdults} 
                min={1} 
                max={maxGuests - children}
            />
            <Divider sx={{ my: 1.5 }} />
            <GuestCounter 
                label={t('booking.children')} 
                subLabel="Age 2-12"
                value={children} 
                onChange={setChildren} 
                min={0}
                max={maxGuests - adults}
            />
        </Paper>

        <Button 
            variant="contained" 
            fullWidth 
            size="large"
            onClick={handleOpen}
            sx={{ 
                py: 1.8, 
                fontWeight: 800, 
                fontSize: '1.1rem',
                borderRadius: 50, 
                textTransform: 'none',
                boxShadow: theme.shadows[4],
                '&:hover': { transform: 'translateY(-1px)', boxShadow: theme.shadows[8] }
            }}
        >
            {/* Smart CTA: Show "Book Now" if instant confirm, else "Check Availability" */}
            {bookingPolicy.instantConfirmation ? t('booking.cta.bookNow') : t('booking.cta.checkAvailability')}
        </Button>

      </Paper>

      {/* CONFIRMATION MODAL */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{t('booking.dialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
             {t('booking.dialogSubtitle', { tour: experienceTitle, date: selectedDate?.format('MMMM D, YYYY') ?? '' })}
          </DialogContentText>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between' }}>
             <Box>
                <Typography variant="caption" display="block" color="text.secondary">{t('booking.selectDate')}</Typography>
                <Typography variant="body2" fontWeight="bold">{selectedDate?.format('MMM D, YYYY')}</Typography>
             </Box>
             <Box>
                <Typography variant="caption" display="block" color="text.secondary">{t('booking.guests')}</Typography>
                <Typography variant="body2" fontWeight="bold">
                    {adults} {t('booking.adults').split(' ')[0]}, {children} {t('booking.children').split(' ')[0]}
                </Typography>
             </Box>
          </Paper>

          <Stack spacing={2}>
            <TextField required label={t('booking.nameLabel')} fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            <TextField required label={t('booking.emailLabel')} type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField required label={t('booking.phoneLabel')} type="tel" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label={t('booking.notesLabel')} multiline rows={3} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">{t('booking.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} size="large">
            {loading ? t('booking.loading') : t('booking.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}