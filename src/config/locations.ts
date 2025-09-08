import { LOCATIONS } from './site';

export type Location = {
  id: string;
  name: string;
};

export const locations = LOCATIONS.map(location => ({
  id: location.id,
  name: location.name,
}));