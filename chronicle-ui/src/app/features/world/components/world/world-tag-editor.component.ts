import { Component, computed, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { LocationType } from '../../../../core/types/enums/location-type.enum';
import { TagMetadataForm } from '../../types/tag-metadata.types';

const LOCATION_TYPE_ICON_PATHS: Record<LocationType, string> = {
  [LocationType.City]: '/icons/locations/city.svg',
  [LocationType.Dungeon]: '/icons/locations/dungeon.svg',
  [LocationType.Wilderness]: '/icons/locations/wilderness.svg',
  [LocationType.Other]: '/icons/locations/other.svg'
};

@Component({
  selector: 'app-world-tag-editor',
  imports: [FormField],
  templateUrl: './world-tag-editor.component.html'
})
export class WorldTagEditorComponent {
  readonly tagMetadataForm = input.required<TagMetadataForm>();

  protected readonly locationTypes = Object.values(LocationType);

  // Computed: get icon path for current location type
  protected readonly currentLocationIconPath = computed(() => {
    const locationType = this.tagMetadataForm().locationType().value();
    return LOCATION_TYPE_ICON_PATHS[locationType];
  });
}
