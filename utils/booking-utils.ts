import dayjs, { Dayjs } from 'dayjs';

/**
 * Calculates the exact date and time by which a user must cancel to get a full refund.
 * Mimics Booking.com's "Free cancellation before [Date]" logic.
 */
export function getCancellationDeadline(bookingDate: Dayjs | null, hoursBefore: number): string {
  if (!bookingDate) return '';
  
  // Example: Booking is for Dec 20. Policy is 24h. Deadline is Dec 19.
  const deadline = bookingDate.subtract(hoursBefore, 'hour');
  
  return deadline.format('MMMM D, YYYY'); // e.g., "December 19, 2025"
}

/**
 * Generates the "Urgency" text based on remaining spots.
 * Mimics Booking.com's "Only X rooms left" logic.
 */
export function getScarcityMessage(spotsLeft?: number): string | null {
  // Only show urgency if spots are critically low (e.g., less than 5)
  if (spotsLeft !== undefined && spotsLeft > 0 && spotsLeft < 5) {
    return `Only ${spotsLeft} spots left at this price!`;
  }
  return null;
}