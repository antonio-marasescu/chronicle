import { Location } from '../view/location-view.types';

export type CreateLocation = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateLocation = Partial<Omit<Location, 'id' | 'worldId' | 'createdAt' | 'updatedAt'>>;
