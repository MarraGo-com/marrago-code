// /src/app/api/admin/bookings/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const revalidate = 0; // Don't cache this admin route

export async function GET() {
  try {
    const bookingsRef = adminDb.collection('bookings');
    // Order by newest first
    const bookingsSnapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
    
    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = doc.data();

      // ▼▼▼ FIX DATE HANDLING FOR OLD VS NEW DATA ▼▼▼
      // Determine which field holds the booking date (old 'requestedDate' vs new 'date')
      let bookingDateIso = null;

      // Check for new format first ('date' field)
      if (data.date && typeof data.date.toDate === 'function') {
          bookingDateIso = data.date.toDate().toISOString();
      // Fallback to old format ('requestedDate' field)
      } else if (data.requestedDate && typeof data.requestedDate.toDate === 'function') {
          bookingDateIso = data.requestedDate.toDate().toISOString();
      }
      // ▲▲▲

      return {
        id: doc.id,
        // Spread all data fields (this includes new nested 'customer', 'guests', 'notes' objects)
        ...data,
        // Safe timestamp serialization
        createdAt: data.createdAt?.toDate().toISOString(),
        // Provide a standardized date field for the frontend UI to use
        bookingDate: bookingDateIso, 
      };
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for admin:", error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}