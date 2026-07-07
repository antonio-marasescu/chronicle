import { Component, input, output } from '@angular/core';
import { LocationType } from '../../../../core/types/enums/location-type.enum';
import { CreateLocation } from '../../../../core/types/dtos/write/location-write.types';

export type TagMetadata = CreateLocation;

const LOCATION_TYPE_ICON_PATHS: Record<LocationType, string> = {
  [LocationType.City]: '/icons/locations/city.svg',
  [LocationType.Dungeon]: '/icons/locations/dungeon.svg',
  [LocationType.Wilderness]: '/icons/locations/wilderness.svg',
  [LocationType.Other]: '/icons/locations/other.svg'
};

@Component({
  selector: 'app-world-tag-editor',
  templateUrl: './world-tag-editor.component.html'
})
export class WorldTagEditorComponent {
  readonly metadata = input.required<TagMetadata>();

  readonly metadataChange = output<TagMetadata>();

  protected readonly LocationType = LocationType;
  protected readonly locationTypes = Object.values(LocationType);
  protected readonly locationTypeIconPaths = LOCATION_TYPE_ICON_PATHS;

  onNameChange(event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    this.metadataChange.emit({ ...this.metadata(), name });
  }

  onDescriptionChange(event: Event): void {
    const description = (event.target as HTMLTextAreaElement).value;
    this.metadataChange.emit({ ...this.metadata(), description });
  }

  onBackstoryChange(event: Event): void {
    const backstory = (event.target as HTMLTextAreaElement).value;
    this.metadataChange.emit({ ...this.metadata(), backstory });
  }

  onLocationTypeChange(event: Event): void {
    const locationType = (event.target as HTMLSelectElement).value as LocationType;
    this.metadataChange.emit({ ...this.metadata(), locationType });
  }

  onColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.metadataChange.emit({ ...this.metadata(), color });
  }

  onSizeChange(event: Event): void {
    const size = Number((event.target as HTMLInputElement).value);
    this.metadataChange.emit({ ...this.metadata(), size });
  }

  getLocationIconPath(type: LocationType): string {
    return this.locationTypeIconPaths[type];
  }
}
