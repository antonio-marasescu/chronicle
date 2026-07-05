import { World } from '../view/world-view.types';

export type CreateWorld = Omit<
  World,
  'id' | 'campaignId' | 'locationIds' | 'createdAt' | 'updatedAt'
>;

export type UpdateWorld = Partial<
  Omit<World, 'id' | 'campaignId' | 'locationIds' | 'createdAt' | 'updatedAt'>
>;
