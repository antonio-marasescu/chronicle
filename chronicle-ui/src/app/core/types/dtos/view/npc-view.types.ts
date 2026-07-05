import { NpcType } from '../../enums/npc-type.enum';

export type Npc = {
  id: string;
  name: string;
  description: string;
  backstory: string;
  npcType: NpcType;
  loot?: string;
  motivations?: string[];
  pitfalls?: string[];
  interestLevel: number | null;
  createdAt: string;
  updatedAt: string;
};
