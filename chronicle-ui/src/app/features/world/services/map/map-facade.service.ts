import { Injectable, inject, signal, computed } from '@angular/core';
import { Tag, WorldMap } from '../../types/world.types';
import { MapRendererService } from './map-renderer.service';

@Injectable()
export class MapFacadeService {
  private readonly renderer = inject(MapRendererService);
  private readonly maps = signal<WorldMap[]>([]);
  private readonly activeMapId = signal<string | null>(null);

  readonly mapList = this.maps.asReadonly();
  readonly activeMap = computed(() => {
    const id = this.activeMapId();
    return this.maps().find(m => m.id === id) ?? null;
  });

  addMap(name: string, image: File): void {
    const imageUrl = URL.createObjectURL(image);
    const map: WorldMap = {
      id: crypto.randomUUID(),
      name,
      imageUrl,
      layers: [],
      tags: []
    };
    this.maps.update(maps => [...maps, map]);
    this.activeMapId.set(map.id);
    this.renderer.loadImage(imageUrl);
  }

  removeMap(id: string): void {
    const map = this.maps().find(m => m.id === id);
    if (map) {
      URL.revokeObjectURL(map.imageUrl);
    }
    this.maps.update(maps => maps.filter(m => m.id !== id));
    if (this.activeMapId() === id) {
      this.activeMapId.set(null);
      this.renderer.clear();
    }
  }

  selectMap(id: string): void {
    this.activeMapId.set(id);
  }

  addTag(mapId: string, label: string, color: string, x: number, y: number): void {
    const tag: Tag = { id: crypto.randomUUID(), label, color, x, y };
    this.maps.update(maps =>
      maps.map(m => (m.id === mapId ? { ...m, tags: [...m.tags, tag] } : m))
    );
  }

  removeTag(mapId: string, tagId: string): void {
    this.maps.update(maps =>
      maps.map(m => (m.id === mapId ? { ...m, tags: m.tags.filter(t => t.id !== tagId) } : m))
    );
  }
}
