import { LOCATIONS } from './site';

export const locations = LOCATIONS.map(location => ({
  id: location.id,
  name: location.name,
}));