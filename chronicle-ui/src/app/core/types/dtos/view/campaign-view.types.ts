import { World } from './world-view.types';

export type Campaign = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  worldId: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignWithWorld = Campaign & {
  world: World | null;
};
