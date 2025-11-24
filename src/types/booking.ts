// /src/types/booking.ts

export interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  // These timestamps are strings because they are serialized by the API before reaching the client
  createdAt: string; 
  updatedAt?: string | null;

  // ▼▼▼ NEW STRUCTURE (For new bookings) ▼▼▼
  customer?: {
    name: string;
    email: string;
    phone?: string; // Phone is optional as very old records might not have it
  };
  guests?: {
    adults: number;
    children: number;
    total: number;
  };
  // The standardized date field our updated API now provides
  bookingDate?: string; 
  notes?: string;
  // ▲▲▲

  // ▼▼▼ LEGACY FIELDS (Kept optional for backward compatibility with old records) ▼▼▼
  // These exist on old documents in Firestore, so we keep them defined here 
  // so TypeScript knows they might exist on older booking objects.
  customerName?: string;
  customerEmail?: string;
  requestedDate?: string;
  numberOfGuests?: number;
  // ▲▲▲
}