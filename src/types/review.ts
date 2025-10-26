// -------------------------------------------------------------------------
// 1. NEW FILE: /src/types/review.ts
// Create a new 'types' folder in your 'src' directory for this file if it doesn't exist.
// -------------------------------------------------------------------------
export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  experienceId: string;
  isApproved: boolean;
  createdAt: string; // Serialized as an ISO string
  author?: string;
  location?: string;
  avatar?: string; // URL to the author's avatar image
  // This field is added for convenience in the admin panel
  experienceTitle?: string; 
  comment?: string;
}
