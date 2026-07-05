import { Npc } from '../view/npc-view.types';

export type CreateNpc = Omit<Npc, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateNpc = Partial<Omit<Npc, 'id' | 'createdAt' | 'updatedAt'>>;
