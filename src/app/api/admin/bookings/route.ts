// /src/app/api/admin/bookings/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import serializeTimestamps from '@/lib/firestore-serialize';

export const revalidate = 0; // Don't cache this admin route

export async function GET() {
  try {
    const bookingsRef = adminDb.collection('bookings');
    // Order by newest first
    const bookingsSnapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
    
    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = doc.data();
      const safe = serializeTimestamps(data as any) as Record<string, any>;

      // Provide a standardized date field for the frontend UI to use
      const bookingDate = safe.date ?? safe.requestedDate ?? null;

      return {
        id: doc.id,
        ...safe,
        bookingDate,
      };
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for admin:", error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}