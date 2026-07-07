import { inject, Injectable } from '@angular/core';
import { MapAction, MapActionType } from '../../types/map-action.types';
import { Location } from '../../../../core/types/dtos/view/location-view.types';
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
      case MapActionType.SELECT_TAG:
        this.handleSelectTag(x, y);
        break;
    }
  }

  private handlePlaceTag(metadata: CreateLocation, x: number, y: number): void {
    const location: Location = {
      id: crypto.randomUUID(),
      worldId: '', // Will be set when persisting
      name: metadata.name,
      description: metadata.description,
      backstory: metadata.backstory,
      color: metadata.color,
      size: metadata.size,
      locationType: metadata.locationType,
      coordinates: { x, y },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.renderer.addTag(location);
  }

  private handleSelectTag(x: number, y: number): void {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pixelX = (x - rect.left) * (canvas.width / rect.width);
    const pixelY = (y - rect.top) * (canvas.height / rect.height);

    const tag = this.renderer.getTagAt(pixelX, pixelY);
    this.renderer.selectTag(tag ? tag.id : null);
  }
}
