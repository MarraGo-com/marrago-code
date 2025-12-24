// src/config/locations.ts

import { siteConfig } from '@/config/client-data';

// --- Types ---

// Type for the New Wizard (Clusters)
export type DestinationCluster = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tags: string[]; // specific cities/spots inside this cluster
};

// Type for Legacy Support (Admin Forms, Dropdowns)
export type Location = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
};

// --- 1. THE MASTER ATLAS (Superset of all Morocco) ---
const MASTER_CLUSTERS: DestinationCluster[] = [
  {
    id: 'marrakech-region',
    title: 'Marrakech & Surroundings',
    subtitle: 'The Red City, Agafay Desert, and Atlas foothills.',
    image: '/images/locations/marrakech-region.webp',
    tags: ['Marrakech', 'Agafay', 'Ourika', 'Ouirgane', 'Palmeraie']
  },
  {
    id: 'agadir-coast',
    title: 'Agadir & Surf Coast',
    subtitle: 'Sun, surf, and endless Atlantic horizons.',
    image: '/images/locations/agadir-coast.webp',
    tags: ['Agadir', 'Taghazout', 'Imsouane', 'Mirleft', 'Legzira', 'Sidi Ifni']
  },
  {
    id: 'deep-desert',
    title: 'The Great Sahara',
    subtitle: 'Golden dunes, starry nights, and ancient Kasbahs.',
    image: '/images/locations/deep-desert.webp',
    tags: ['Merzouga', 'Zagora', 'M\'Hamid', 'Erfoud', 'Chegaga', 'Errachidia']
  },
  {
    id: 'imperial-north',
    title: 'Fes & Imperial Cities',
    subtitle: 'Centuries of history in Fes, Meknes, and Volubilis.',
    image: '/images/locations/imperial-north.webp',
    tags: ['Fes', 'Meknes', 'Volubilis', 'Ifrane', 'Azrou']
  },
  {
    id: 'tangier-rif',
    title: 'The North & Blue City',
    subtitle: 'Where the Mediterranean meets the mountains.',
    image: '/images/locations/tangier-rif.webp',
    tags: ['Tangier', 'Chefchaouen', 'Tetouan', 'Asilah', 'Al Hoceima']
  },
  {
    id: 'atlas-mountains',
    title: 'High Atlas Mountains',
    subtitle: 'Hiking peaks and authentic Berber villages.',
    image: '/images/locations/atlas-mountains.webp',
    tags: ['Imlil', 'Toubkal', 'Ait Bouguemez', 'Ouzoud', 'Bin El Ouidane']
  },
  {
    id: 'southern-oasis',
    title: 'Road of 1000 Kasbahs',
    subtitle: 'Ouarzazate, Skoura, and the Dades Valley.',
    image: '/images/locations/southern-oasis.webp',
    tags: ['Ouarzazate', 'Skoura', 'Dades', 'Todra', 'Tinghir', 'Kelaat M\'Gouna']
  },
  {
    id: 'casablanca-rabat',
    title: 'Atlantic Capitals',
    subtitle: 'Modern hubs of culture, business, and history.',
    image: '/images/locations/casablanca-rabat.webp',
    tags: ['Casablanca', 'Rabat', 'El Jadida', 'Mohammedia']
  },
  {
    id: 'essaouira-mogador',
    title: 'Essaouira & Coast',
    subtitle: 'Wind, art, and the charm of the ancient Mogador.',
    image: '/images/locations/essaouira-mogador.webp',
    tags: ['Essaouira', 'Safi', 'Oualidia']
  },
  {
    id: 'dakhla-south',
    title: 'Dakhla & Deep South',
    subtitle: 'Where the desert meets the ocean lagoon.',
    image: '/images/locations/dakhla-south.webp',
    tags: ['Dakhla', 'Laayoune']
  }
];

// --- 2. INTELLIGENT FILTERING ---

// Parse the raw data from siteConfig into a clean array of lowercase strings
const rawConfigValue: string | string[] = siteConfig.tourLocationsServed as unknown as (string | string[]);

const operatorLocations: string[] = typeof rawConfigValue === 'string'
  ? rawConfigValue.split(',').map((s: string) => s.trim().toLowerCase()) 
  : (Array.isArray(rawConfigValue) ? rawConfigValue.map((s: string) => s.trim().toLowerCase()) : []);

// Filter the master list for the Wizard (Clusters)
export const destinationClusters: DestinationCluster[] = MASTER_CLUSTERS.filter((cluster) => {
  return cluster.tags.some((tag: string) => 
    operatorLocations.includes(tag.toLowerCase())
  );
});

// --- 3. EXPORT 1: All Location Names (String Array) ---
// Useful for simple dropdowns or validation
export const allLocationNames = MASTER_CLUSTERS.flatMap(c => c.tags).sort();

// --- 4. EXPORT 2: Legacy Locations Object (Object Array) ---
// This RESTORES backward compatibility with your old files (CreateExperience, EditExperienceForm)
// It automatically maps the names back to objects with { id, name, image }
export const locations: Location[] = allLocationNames.map((name) => {
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
  return {
    id: slug,
    name: name,
    slug: slug,
    // Auto-generated image path based on slug
    image: `/images/locations/${slug}.webp`, 
    description: `Explore the beauty of ${name} with our expert guides.`
  };
});

// Default fallback
export const DEFAULT_LOCATION_ID = locations.length > 0 ? locations[0].id : 'marrakech';