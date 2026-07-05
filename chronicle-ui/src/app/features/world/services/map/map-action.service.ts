import { inject, Injectable } from '@angular/core';
import { MapAction, MapActionType } from '../../types/map-action.types';
import { Tag } from '../../types/map.types';
import { MapRendererService } from './map-renderer.service';
import { CreateLocation } from '../../../../core/types/dtos/write/location-write.types';

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

  private handlePlaceTag(metadata: CreateLocation, x: number, y: number): void {
    const tag: Tag = {
      id: crypto.randomUUID(),
      label: metadata.name,
      color: metadata.color,
      size: metadata.size,
      locationType: metadata.locationType,
      x,
      y
    };
    this.renderer.addTag(tag);
  }
}
