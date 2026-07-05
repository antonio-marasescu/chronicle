import { Npc } from '../../types/dtos/view/npc-view.types';
import { NpcType } from '../../types/enums/npc-type.enum';

export const MOCK_NPCS: Npc[] = [
  {
    id: 'npc-1',
    name: 'Lord Malachar',
    description: 'A dark sorcerer with eyes like burning coals',
    backstory: 'Once a royal advisor, corrupted by forbidden magic in pursuit of immortality',
    npcType: NpcType.Villain,
    loot: 'Staff of Shadows, Ancient Grimoire',
    motivations: ['Achieve immortality', 'Conquer the kingdom', 'Destroy the Crown of Stars'],
    pitfalls: ['Arrogance', 'Fear of mortality'],
    interestLevel: 9,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'npc-2',
    name: 'Elara Moonwhisper',
    description: 'An elven ranger with silver hair and keen eyes',
    backstory: 'Guardian of the ancient forests, seeking allies against the encroaching darkness',
    npcType: NpcType.Friendly,
    motivations: ['Protect the forest', 'Find the lost artifact'],
    pitfalls: ['Distrusts outsiders'],
    interestLevel: 7,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'npc-3',
    name: 'Grimm the Trader',
    description: 'A stout merchant with a mysterious past',
    backstory: 'Travels the realm selling rare goods, but seems to know too much',
    npcType: NpcType.Neutral,
    loot: 'Various trade goods',
    interestLevel: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'npc-4',
    name: 'The Hooded Figure',
    description: 'A mysterious individual who appears at pivotal moments',
    backstory: 'Unknown origins, seems to manipulate events from the shadows',
    npcType: NpcType.Secret,
    motivations: ['Unknown motives'],
    pitfalls: ['Too secretive', 'Unreliable'],
    interestLevel: 10,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];
