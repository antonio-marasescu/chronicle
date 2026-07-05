import { Injectable, signal, computed } from '@angular/core';
import { Tag, WorldMap } from '../../types/map.types';

@Injectable({ providedIn: 'root' })
export class MapFacadeService {
  private readonly maps = signal<WorldMap[]>([]);
  private readonly activeMapId = signal<string | null>(null);

  readonly mapList = this.maps.asReadonly();
  readonly activeMap = computed(() => {
    const id = this.activeMapId();
    return this.maps().find(m => m.id === id) ?? null;
  });

  addMap(map: Omit<WorldMap, 'id'>, image: File): void {
    const imageUrl = URL.createObjectURL(image);
    const newMap: WorldMap = { ...map, id: crypto.randomUUID(), imageUrl };
    this.maps.update(maps => [...maps, newMap]);
    this.activeMapId.set(newMap.id);
  }

  removeMap(id: string): void {
    const map = this.maps().find(m => m.id === id);
    if (map) {
      URL.revokeObjectURL(map.imageUrl);
    }
    this.maps.update(maps => maps.filter(m => m.id !== id));
    if (this.activeMapId() === id) {
      this.activeMapId.set(null);
    }
  }

  selectMap(id: string): void {
    this.activeMapId.set(id);
  }

  addTag(mapId: string, tag: Omit<Tag, 'id'>): void {
    const newTag: Tag = { ...tag, id: crypto.randomUUID() };
    this.maps.update(maps =>
      maps.map(m => (m.id === mapId ? { ...m, tags: [...m.tags, newTag] } : m))
    );
  }

  updateTag(mapId: string, tagId: string, changes: Partial<Omit<Tag, 'id'>>): void {
    this.maps.update(maps =>
      maps.map(m =>
        m.id === mapId
          ? { ...m, tags: m.tags.map(t => (t.id === tagId ? { ...t, ...changes } : t)) }
          : m
      )
    );
  }

  removeTag(mapId: string, tagId: string): void {
    this.maps.update(maps =>
      maps.map(m => (m.id === mapId ? { ...m, tags: m.tags.filter(t => t.id !== tagId) } : m))
    );
  }
}
