import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MapAction, MapActionType } from '../../types/map-action.types';
import { MapFacadeService } from '../../services/map/map-facade.service';
import { MapEditorComponent } from '../map/map-editor.component';

@Component({
  selector: 'app-world-editor',
  templateUrl: './world-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapEditorComponent]
})
export class WorldEditorComponent {
  private readonly facade = inject(MapFacadeService);

  readonly actionOptions = [
    { value: MapActionType.PAN, label: 'Pan' },
    { value: MapActionType.PLACE_TAG, label: 'Place Tag' },
    { value: MapActionType.NONE, label: 'None' }
  ];

  readonly selectedActionType = signal(MapActionType.PAN);

  readonly currentAction = computed<MapAction>(() => {
    const type = this.selectedActionType();
    switch (type) {
      case MapActionType.PLACE_TAG:
        return { type, metadata: { color: '#ef4444', size: 8, label: '' } };
      case MapActionType.PAN:
        return { type };
      default:
        return { type: MapActionType.NONE };
    }
  });

  onActionTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as MapActionType;
    this.selectedActionType.set(value);
  }

  onFileSelected(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (!file) return;
    this.facade.addMap({ name: file.name, imageUrl: '', layers: [], tags: [] }, file);
  }
}
