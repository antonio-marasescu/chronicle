import { World } from '../../types/dtos/view/world-view.types';

export const MOCK_WORLDS: World[] = [
  {
    id: 'world-1',
    campaignId: '1',
    name: 'Eldoria',
    description: 'A vast medieval fantasy realm',
    backstory:
      'Once a prosperous kingdom united under the Crown of Stars, now fractured and in need of heroes',
    locationIds: ['loc-1', 'loc-2'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'world-2',
    campaignId: '2',
    name: 'Frostheim',
    description: 'A frozen tundra full of ice giants and ancient magic',
    backstory: 'The eternal winter began when the Ice Crown was shattered centuries ago',
    locationIds: ['loc-3'],
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'world-3',
    campaignId: '3',
    name: 'Aridian Expanse',
    description: 'An endless desert hiding forgotten civilizations',
    backstory: 'The sands hold secrets of a time before recorded history',
    locationIds: [],
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z'
  }
];
