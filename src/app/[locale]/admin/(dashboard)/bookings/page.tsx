// -------------------------------------------------------------------------
// 3. UPDATED FILE: /src/app/[locale]/admin/(dashboard)/bookings/page.tsx
// This is the main page for managing booking requests, now conditionally
// rendered based on siteConfig.hasBookingEngine.
// -------------------------------------------------------------------------
import { Box, Typography } from "@mui/material";
import BookingsTable from "@/components/admin/BookingsTable";
import { getAllAdminBookings } from "@/lib/data";
import { Booking } from "@/types/booking";
import { notFound } from "next/navigation"; // <-- NEW: Import notFound
import { siteConfig } from '@/config/client-data';
import { getTranslations } from "next-intl/server"; // <-- NEW: Import getTranslations

export default async function BookingsAdminPage() {
  // RECTIFICATION: If booking engine is globally disabled, show 404
  if (!siteConfig.hasBookingEngine) {
    notFound(); 
  }

  const bookings = (await getAllAdminBookings()) as Booking[];
  const t = await getTranslations('admin.AdminBookingsPage'); // Assuming you'd add this namespace

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('manageBookingsTitle') || 'Manage Booking Requests'} {/* RECTIFICATION: Use translation */}
      </Typography>
      
      <BookingsTable bookings={bookings} />
    </Box>
  );
}