// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/types/experience.ts
// We are ensuring the 'duration' field is part of our central type definition.
// -------------------------------------------------------------------------
export interface Translation {
  title: string;
  description: string;
  included?: string;
  notIncluded?: string;
  importantInfo?: string;
  itinerary?: string;
}

export interface GalleryImage {
    path: string;
    hidden: boolean;
}

export interface Experience {
  id: string;
  price: { amount: number; currency: string; prefix: string; };
  locationId: string;
  coverImage: string;
  galleryImages?: GalleryImage[];
  duration: string; // The duration of the experience
  tags?: string[];
  translations: {
    en?: Translation;
    fr?: Translation;
    [key: string]: Translation | undefined;
  };
  // The title and description for display are prepared by the parent component
  // and are not part of the core database type.
  title?: string;
  description?: string;
}
