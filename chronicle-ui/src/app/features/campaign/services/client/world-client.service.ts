import { Service, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { World } from '../../../../core/types/dtos/view/world-view.types';
import { CreateWorld, UpdateWorld } from '../../../../core/types/dtos/write/world-write.types';
import { MOCK_WORLDS } from '../../../../core/testing/mocks/world.mocks';

@Service()
export class WorldClientService {
  private worlds = signal<World[]>(MOCK_WORLDS);

  getById(id: string): Observable<World | undefined> {
    const world = this.worlds().find(w => w.id === id);
    return of(world).pipe(delay(100));
  }

  create(campaignId: string, data: CreateWorld): Observable<World> {
    const newWorld: World = {
      ...data,
      id: crypto.randomUUID(),
      campaignId,
      locationIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.worlds.update(worlds => [...worlds, newWorld]);
    return of(newWorld).pipe(delay(100));
  }

  update(id: string, data: UpdateWorld): Observable<World | undefined> {
    const index = this.worlds().findIndex(w => w.id === id);
    if (index === -1) return of(undefined).pipe(delay(100));

    const updated: World = {
      ...this.worlds()[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.worlds.update(worlds => {
      const newWorlds = [...worlds];
      newWorlds[index] = updated;
      return newWorlds;
    });

    return of(updated).pipe(delay(100));
  }

  delete(id: string): Observable<boolean> {
    const index = this.worlds().findIndex(w => w.id === id);
    if (index === -1) return of(false).pipe(delay(100));

    this.worlds.update(worlds => worlds.filter(w => w.id !== id));
    return of(true).pipe(delay(100));
  }
}
