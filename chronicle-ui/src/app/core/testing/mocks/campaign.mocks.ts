import { Campaign } from '../../types/dtos/view/campaign-view.types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'The Lost Kingdom',
    description:
      'A campaign about reclaiming a fallen kingdom from dark forces. The once-prosperous realm of Eldoria has fallen into shadow, its rightful rulers exiled, and its people living under tyranny. Heroes must unite the scattered resistance, forge alliances with ancient powers, and ultimately storm the capital to restore the Crown of Stars to its rightful place.',
    worldId: 'world-1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Shadows of the North',
    description: 'An icy adventure in the frozen wastes',
    worldId: 'world-2',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Desert Mysteries',
    description:
      'Uncover ancient secrets buried in the sands. Deep beneath the Aridian Expanse lie the ruins of a civilization that predates all known history. Strange artifacts have begun surfacing in the markets of border towns, drawing treasure hunters, scholars, and darker forces to the desert. The party must navigate treacherous dunes, decipher cryptic hieroglyphs, and survive deadly traps as they race against rival factions to unlock the power of the ancients before it falls into the wrong hands.',
    worldId: 'world-3',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Coastal Intrigue',
    description:
      'Political machinations in a bustling port city where merchant guilds vie for power, pirates rule the outer islands, and a mysterious plague threatens to destabilize the entire region.',
    worldId: 'world-4',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'The Eternal War',
    description: 'A never-ending conflict between two rival kingdoms',
    worldId: 'world-5',
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-05-01T00:00:00Z'
  }
];
