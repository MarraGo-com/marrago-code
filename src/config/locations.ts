// src/config/locations.ts

// Import siteConfig directly. Next.js will handle making this available.
import { siteConfig } from '@/config/client-data';

export type Location = {
  id: string;
  name: string;
  slug: string; // Add slug for routing if needed
  image?: string; // Optional image for the location
  description?: string; // Optional description
};

// Map the dynamic tourLocationsServed from siteConfig into your Location type
export const locations: Location[] = siteConfig.tourLocationsServed.map(
  (locationName) => ({
    id: locationName.toLowerCase().replace(/\s/g, '-'), // Generate a simple ID
    name: locationName,
    slug: locationName.toLowerCase().replace(/\s/g, '-'), // Generate a slug
    // You can add default images or descriptions here if you have them,
    // or leave them undefined to be added later based on more client data.
  })
);

// You might also export a default location if needed
export const DEFAULT_LOCATION_ID = locations.length > 0 ? locations[0].id : 'marrakech';