// /src/components/booking/BookingForm.tsx
'use client';

import React, { useState } from 'react';
import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  CircularProgress, Alert, Snackbar, Box 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslations } from 'next-intl';

// --- 1. Import the Stripe.js library ---
import { loadStripe } from '@stripe/stripe-js';
import { Experience } from '@/types/experience';

// --- 2. Initialize Stripe with your PUBLIC key ---
// This is safe to do in a client component.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- 3. Update the props to include the price object ---
interface BookingFormProps {
  experienceId: string;
  experienceTitle: string;
  price: Experience['price']; // Use the price type from our central definition
}

export default function BookingFormOld({ experienceId, experienceTitle, price }: BookingFormProps) {
  const t = useTranslations('BookingForm');
  
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [requestedDate, setRequestedDate] = useState<Date | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = () => setFormStatus({ ...formStatus, open: false });

  // --- 4. This is the new, upgraded handleSubmit function ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requestedDate || numberOfGuests < 1) {
      setFormStatus({ open: true, message: t('errorInvalidInput'), severity: 'error' });
      return;
    }
    setLoading(true);

    try {
      // Step A: Create a 'pending' booking in our own database first.
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId,
          experienceTitle,
          customerName,
          customerEmail,
          requestedDate: requestedDate.toISOString(),
          numberOfGuests,
        }),
      });
      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Failed to create booking request.');
      }
      const { id: bookingId } = bookingData;

      // Step B: Now, create the Stripe Checkout session.
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId,
          experienceTitle,
          price,
          customerEmail,
          bookingId, // We pass our internal booking ID to Stripe
        }),
      });
      const checkoutData = await checkoutResponse.json();
      if (!checkoutResponse.ok) {
        throw new Error(checkoutData.error || 'Failed to create payment session.');
      }
      const { sessionId } = checkoutData;

      // Step C: Redirect the user to Stripe's secure payment page.
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          // This error will only be shown if the redirect fails.
          throw new Error(error.message);
        }
      } else {
        throw new Error('Stripe.js has not loaded yet.');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormStatus({ open: true, message: err.message, severity: 'error' });
      } else {
        setFormStatus({ open: true, message: t('errorGeneric'), severity: 'error' });
      }
      setLoading(false); // Make sure to stop loading on error
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setRequestedDate(null);
    setNumberOfGuests(1);
  };

  return (
    <>
      <Button variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.5 }} onClick={handleOpen}>
        {t('bookNowButton')}
      </Button>

      <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
        <DialogTitle>{t('dialogTitle', { experienceTitle })}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <DatePicker
                label={t('dateLabel')}
                value={requestedDate}
                onChange={(newValue) => setRequestedDate(newValue)}
                disablePast
                sx={{ width: '100%' }}
              />
              <TextField
                required
                fullWidth
                type="number"
                label={t('guestsLabel')}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Math.max(1, parseInt(e.target.value, 10)))}
                InputProps={{ inputProps: { min: 1 } }}
              />
              <TextField
                required
                fullWidth
                label={t('nameLabel')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                type="email"
                label={t('emailLabel')}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancelButton')}</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t('submitButtonPay')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={formStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={formStatus.severity} sx={{ width: '100%' }}>
          {formStatus.message}
        </Alert>
      </Snackbar>
    </>
  );
}
