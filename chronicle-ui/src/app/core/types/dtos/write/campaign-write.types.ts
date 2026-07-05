import { Campaign } from '../view/campaign-view.types';

export type CreateCampaign = Omit<Campaign, 'id' | 'worldId' | 'createdAt' | 'updatedAt'>;

export type UpdateCampaign = Partial<Omit<Campaign, 'id' | 'worldId' | 'createdAt' | 'updatedAt'>>;
