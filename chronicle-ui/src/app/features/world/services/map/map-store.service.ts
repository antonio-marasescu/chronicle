import { Injectable, signal, computed } from '@angular/core';
import { Location } from '../../../../core/types/dtos/view/location-view.types';
import { World } from '../../../../core/types/dtos/view/world-view.types';

@Injectable({ providedIn: 'root' })
export class MapStoreService {
  private readonly worlds = signal<World[]>([]);
  private readonly activeWorldId = signal<string | null>(null);
  private readonly locations = signal<Location[]>([]);

  readonly worldList = this.worlds.asReadonly();
  readonly activeWorld = computed(() => {
    const id = this.activeWorldId();
    return this.worlds().find(w => w.id === id) ?? null;
  });
  readonly activeWorldLocations = computed(() => {
    const worldId = this.activeWorldId();
    return this.locations().filter(l => l.worldId === worldId);
  });

  addWorld(world: Omit<World, 'id' | 'createdAt' | 'updatedAt'>, image: File): void {
    const imageUrl = URL.createObjectURL(image);
    const newWorld: World = {
      ...world,
      id: crypto.randomUUID(),
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.worlds.update(worlds => [...worlds, newWorld]);
    this.activeWorldId.set(newWorld.id);
  }

  removeWorld(id: string): void {
    const world = this.worlds().find(w => w.id === id);
    if (world) {
      URL.revokeObjectURL(world.imageUrl);
    }
    this.worlds.update(worlds => worlds.filter(w => w.id !== id));
    // Remove associated locations
    this.locations.update(locs => locs.filter(l => l.worldId !== id));
    if (this.activeWorldId() === id) {
      this.activeWorldId.set(null);
    }
  }

  setWorlds(worlds: World[]): void {
    this.worlds.set(worlds);
  }

  selectWorld(id: string): void {
    this.activeWorldId.set(id);
  }

  addLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newLocation: Location = {
      ...location,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.locations.update(locs => [...locs, newLocation]);
  }

  updateLocation(locationId: string, changes: Partial<Omit<Location, 'id'>>): void {
    this.locations.update(locs =>
      locs.map(l =>
        l.id === locationId ? { ...l, ...changes, updatedAt: new Date().toISOString() } : l
      )
    );
  }

  removeLocation(locationId: string): void {
    this.locations.update(locs => locs.filter(l => l.id !== locationId));
  }
}
