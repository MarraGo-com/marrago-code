'use client';

import React, { Suspense } from 'react';
import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HomeIcon from '@mui/icons-material/Home';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Traveler';
  
  // You can pass the tour title in the URL query params for a personalized touch
  // e.g. /booking-confirmation?name=John&tour=Ouzoud+Falls
  const tourTitle = searchParams.get('tour'); 

  return (
    <Box sx={{ py: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 6,
            background: 'linear-gradient(to bottom, #ffffff, #f9fafb)' 
          }}
        >
          {/* Success Icon */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
          </Box>

          <Typography variant="h4" fontWeight="800" gutterBottom>
            Request Received!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Thank you, {name}.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
            We have received your booking request
            {tourTitle && <span> for <strong>{tourTitle}</strong></span>}. 
            <br />
            Our team will check availability and contact you shortly via <strong>WhatsApp</strong> or <strong>Email</strong> to confirm your spot.
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: '#f0fdf4', borderColor: '#bbf7d0' }}>
             <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
                <WhatsAppIcon sx={{ color: '#16a34a' }} />
                <Typography variant="body2" fontWeight="bold" color="#166534">
                    Expect a message within 2 hours
                </Typography>
             </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
                component={Link} 
                href="/" 
                variant="outlined" 
                startIcon={<HomeIcon />}
                size="large"
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 'bold' }}
            >
                Back to Home
            </Button>
            <Button 
                component={Link} 
                href="/experiences" 
                variant="contained" 
                size="large"
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 'bold', boxShadow: 'none' }}
            >
                Explore More Tours
            </Button>
          </Stack>

        </Paper>
      </Container>
    </Box>
  );
}

// Wrap in Suspense to handle useSearchParams on the client safely
export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<Box sx={{ py: 20, textAlign: 'center' }}>Loading...</Box>}>
        <BookingSuccessContent />
    </Suspense>
  );
}