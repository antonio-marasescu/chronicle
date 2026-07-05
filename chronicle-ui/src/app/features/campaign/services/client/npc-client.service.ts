import { Service, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Npc } from '../../../../core/types/dtos/view/npc-view.types';
import { CreateNpc, UpdateNpc } from '../../../../core/types/dtos/write/npc-write.types';
import { MOCK_NPCS } from '../../../../core/testing/mocks/npc.mocks';

@Service()
export class NpcClientService {
  private npcs = signal<Npc[]>(MOCK_NPCS);

  getById(id: string): Observable<Npc | undefined> {
    const npc = this.npcs().find(n => n.id === id);
    return of(npc).pipe(delay(100));
  }

  create(data: CreateNpc): Observable<Npc> {
    const newNpc: Npc = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.npcs.update(npcs => [...npcs, newNpc]);
    return of(newNpc).pipe(delay(100));
  }

  update(id: string, data: UpdateNpc): Observable<Npc | undefined> {
    const index = this.npcs().findIndex(n => n.id === id);
    if (index === -1) return of(undefined).pipe(delay(100));

    const updated: Npc = {
      ...this.npcs()[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.npcs.update(npcs => {
      const newNpcs = [...npcs];
      newNpcs[index] = updated;
      return newNpcs;
    });

    return of(updated).pipe(delay(100));
  }

  delete(id: string): Observable<boolean> {
    const index = this.npcs().findIndex(n => n.id === id);
    if (index === -1) return of(false).pipe(delay(100));

    this.npcs.update(npcs => npcs.filter(n => n.id !== id));
    return of(true).pipe(delay(100));
  }
}
