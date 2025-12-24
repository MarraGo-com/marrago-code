// src/types/experience.ts

// --- 1. NEW STRICT TYPES (The "World Class" Standard) ---
export type DurationUnit = 'minutes' | 'hours' | 'days';
export type ExperienceTag = 'new' | 'popular' | 'bestseller' | 'likelyToSellOut';
export type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';

export interface FAQItem {
  question: string;
  answer: string;
}

// 1. ADD THIS NEW INTERFACE (Defines a single step in the timeline)
export interface TimelineStep {
  title: string;          // e.g. "Jemaa el-Fnaa"
  subtitle?: string;      // e.g. "Stop: 45 minutes"
  description?: string;   // e.g. "Explore the market..."
  type: 'stop' | 'passBy' | 'transport' | 'admission' | 'activity' | 'meal'; // Determines the Icon
  duration?: string;      // e.g. "45 minutes"
  admission?: 'included' | 'notIncluded' | 'free'; // Viator style status
}

export interface Translation {
  title?: string;
  description?: string;
  shortDescription?: string; 
  highlights?: string;
  included?: string;
  notIncluded?: string;
  importantInfo?: string;
  itinerary?: string;
  faqs?: FAQItem[];
  program?: TimelineStep[];
  
  // NOTE: You can optionally add a localized 'duration' string here 
  // if you ever need to override the automatic formatter.
  duration?: string; 
}

export interface GalleryImage {
  path: string;
  hidden: boolean;
}

export interface Experience {
  id: string;
  price: {
    amount: number;
    currency: string;
    prefix: string;
  };
  locationId: string;
  
  coverImage: string;
  galleryImages: GalleryImage[];

  // --- REFACTORED: RAW DATA FOR DURATION ---
  // Was: duration: string;
  durationValue: number;       // e.g. 6
  durationUnit: DurationUnit;  // e.g. 'hours'

  // --- REFACTORED: STRICT TAGS ---
  // Was: tags?: string[];
  tags?: ExperienceTag[]; 

  // --- REFACTORED: STRICT LANGUAGES ---
  // Was: languages?: string[];
  languages?: LanguageCode[]; 

  // Quick Facts
  maxGuests?: number;
  tourCode?: string;
  startTimes?: string[]; // Times like "10:00" are fine as strings

  // Urgency & Scarcity Triggers (Viator/Booking.com Style)
  scarcity?: {
    isLikelyToSellOut?: boolean; // Triggers red badge
    spotsLeft?: number;          // Triggers "Only X spots left"
  };

  // Conversion & Trust Policies
  bookingPolicy?: {
    cancellationHours: number;   // e.g. 24. Used to calc exact date.
    isPayLater?: boolean;        // Triggers "Reserve now & pay later"
    instantConfirmation?: boolean;
  };

  // Feature Flags (For badges)
  features?: {
    mobileTicket?: boolean;
    pickupIncluded?: boolean;
  };

  // Meeting Point (Optional)
  latitude?: number | undefined;
  longitude?: number | undefined;

  // Localized Content
  translations: {
    [key: string]: Translation;
    en: Translation;
    fr: Translation;
    es: Translation;
  };
  
  // Aggregated Stats (Performance Optimization)
  rating?: number;      // e.g. 4.8
  reviewCount?: number; // e.g. 124
  
  // Metadata
  createdAt: any; 
  updatedAt?: any;
}