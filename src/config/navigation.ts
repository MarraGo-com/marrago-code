import { destinationClusters } from '@/config/locations';

// --- 1. SMART DESTINATIONS ---
// We map ALL active clusters. The Component will handle pagination/slicing.
export const NAV_DESTINATIONS = destinationClusters.map(cluster => ({
  id: cluster.id,
  title: cluster.title, 
  image: cluster.image, 
  // Link to the first tag (city) in the cluster
  link: `/experiences?location=${cluster.tags[0].toLowerCase()}` 
}));

// --- 2. INTERESTS (Static) ---
export const NAV_INTERESTS = [
  {
    id: 'adventure',
    title: 'Adventure & Sport',
    description: 'Quad biking, hiking & thrills',
    icon: 'Terrain', 
    link: '/experiences?category=adventure'
  },
  {
    id: 'culture',
    title: 'Culture & History',
    description: 'City tours, museums & heritage',
    icon: 'Museum',
    link: '/experiences?category=city'
  },
  {
    id: 'food',
    title: 'Food & Culinary',
    description: 'Cooking classes & food tours',
    icon: 'Restaurant',
    link: '/experiences?category=food'
  },
  {
    id: 'wellness',
    title: 'Wellness & Relax',
    description: 'Hammam, spa & yoga retreats',
    icon: 'Spa',
    link: '/experiences?category=wellness'
  }
];