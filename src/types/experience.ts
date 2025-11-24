// src/types/experience.ts

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Translation {
  title?: string;
  description?: string;
  shortDescription?: string; // <--- NEW FIELD
  highlights?: string;
  included?: string;
  notIncluded?: string;
  importantInfo?: string;
  itinerary?: string;
  faqs?: FAQItem[];
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
  duration: string;
  tags?: string[];

  // Quick Facts (Optional)
  maxGuests?: number;
  tourCode?: string;
  languages?: string[];
  startTimes?: string[];

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

  // Metadata
  createdAt: any; // Using 'any' for Firestore Timestamp compatibility
  updatedAt?: any;
}