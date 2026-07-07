import { Location } from '../../types/dtos/view/location-view.types';
import { LocationType } from '../../types/enums/location-type.enum';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    worldId: 'world-1',
    name: 'Castle Blackwood',
    description: 'A dark fortress atop a jagged cliff',
    backstory: 'Once the seat of the noble Blackwood family, now occupied by dark forces',
    locationType: LocationType.City,
    color: '#3b82f6',
    size: 24,
    coordinates: { x: 100, y: 200 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'loc-2',
    worldId: 'world-1',
    name: 'The Whispering Catacombs',
    description: 'Ancient underground tunnels filled with undead',
    backstory: 'A burial ground for kings that predates the kingdom itself',
    locationType: LocationType.Dungeon,
    color: '#8b5cf6',
    size: 20,
    coordinates: { x: 150, y: 180 },
    parentLocationId: 'loc-1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'loc-3',
    worldId: 'world-2',
    name: 'Frostpeak Village',
    description: 'A small settlement clinging to survival in the frozen wastes',
    backstory: 'The last bastion of civilization in the north',
    locationType: LocationType.City,
    color: '#06b6d4',
    size: 28,
    coordinates: { x: 50, y: 300 },
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z'
  }
];
