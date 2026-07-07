import { World } from '../../types/dtos/view/world-view.types';

export const MOCK_WORLD_MAPS: World[] = [
  {
    id: 'map-1',
    campaignId: 'campaign-1',
    name: 'Eldoria Map',
    description: 'The world of Eldoria',
    backstory: '',
    imageUrl: 'assets/images/campaigns/mock-map.jpg',
    locationIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'map-2',
    campaignId: 'campaign-1',
    name: 'Frostheim Map',
    description: 'The frozen realm of Frostheim',
    backstory: '',
    imageUrl: 'assets/images/campaigns/mock-map.jpg',
    locationIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'map-3',
    campaignId: 'campaign-1',
    name: 'Aridian Expanse Map',
    description: 'The vast deserts of Aridian',
    backstory: '',
    imageUrl: 'assets/images/campaigns/mock-map.jpg',
    locationIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
