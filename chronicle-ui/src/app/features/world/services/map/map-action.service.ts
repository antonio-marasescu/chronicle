import { inject, Injectable } from '@angular/core';
import { MapAction, MapActionType, PlaceTagMetadata } from '../../types/map-action.types';
import { Tag } from '../../types/map.types';
import { MapRendererService } from './map-renderer.service';

@Injectable()
export class MapActionService {
  private readonly renderer = inject(MapRendererService);

  dispatch(action: MapAction, x: number, y: number): void {
    switch (action.type) {
      case MapActionType.PLACE_TAG:
        this.handlePlaceTag(action.metadata, x, y);
        break;
    }
  }

  private handlePlaceTag(metadata: PlaceTagMetadata, x: number, y: number): void {
    const tag: Tag = {
      id: crypto.randomUUID(),
      label: metadata.label,
      color: metadata.color,
      size: metadata.size,
      x,
      y
    };
    this.renderer.addTag(tag);
  }
}
