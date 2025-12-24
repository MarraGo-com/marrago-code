// -------------------------------------------------------------------------
// /src/types/review.ts
// -------------------------------------------------------------------------

export interface Review {
  // --- CORE FIELDS (Existing) ---
  id: string;
  authorName: string;
  rating: number;
  text: string;
  experienceId: string;
  isApproved: boolean;
  createdAt: string; // ISO string

  // --- OPTIONAL / LEGACY FIELDS ---
  author?: string;   // Alias for authorName (useful if UI expects 'author')
  location?: string; // e.g., "London, UK"
  avatar?: string;   // URL to image
  experienceTitle?: string; 
  comment?: string;
  tourName?: string;
  // --- 🟢 NEW: "WORLD CLASS" METADATA ---
  // These drive the TripAdvisor-style trust signals
  
  // 1. Context: "Traveled as Couple", "Family with Teens"
  travelerType?: string; 

  // 2. Trust: Distinct from 'isApproved'. 
  // 'isApproved' = Admin allowed it. 
  // 'isVerifiedBooking' = Linked to a real transaction (Green Badge).
  isVerifiedBooking?: boolean; 
  
  // 3. Formatted Date: "October 2024" (Easier for UI than parsing ISO every time)
  date?: string; 
}