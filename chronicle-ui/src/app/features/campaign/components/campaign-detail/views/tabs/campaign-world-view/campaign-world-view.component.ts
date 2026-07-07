import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { MapEditorComponent } from '../../../../../../world/components/map/map-editor.component';
import { WorldEditorMenuComponent } from '../../../../../../world/components/world/world-editor-menu.component';
import {
  TagMetadata,
  WorldTagEditorComponent
} from '../../../../../../world/components/world/world-tag-editor.component';
import { MapAction, MapActionType } from '../../../../../../world/types/map-action.types';
import {
  WorldEditorMenuAction,
  WorldEditorMenuItem
} from '../../../../../../world/types/world-editor-menu.types';
import { MapFacadeService } from '../../../../../../world/services/map/map-facade.service';
import { MOCK_WORLD_MAPS } from '../../../../../../../core/testing/mocks/world-map.mocks';
import { LocationType } from '../../../../../../../core/types/enums/location-type.enum';
import { Tag } from '../../../../../../world/types/map.types';

@Component({
  selector: 'app-campaign-world-view',
  imports: [MapEditorComponent, WorldEditorMenuComponent, WorldTagEditorComponent],
  templateUrl: './campaign-world-view.component.html'
})
export class CampaignWorldViewComponent implements OnInit {
  private readonly mapFacade = inject(MapFacadeService);
  private readonly mapEditor = viewChild.required(MapEditorComponent);

  readonly menuItems: WorldEditorMenuItem[] = [
    { action: WorldEditorMenuAction.PAN, label: 'Pan', icon: 'pan_tool' },
    { action: WorldEditorMenuAction.SELECT_TAG, label: 'Select Tag', icon: 'touch_app' },
    { action: WorldEditorMenuAction.PLACE_TAG, label: 'Place Tag', icon: 'location_on' },
    {
      action: WorldEditorMenuAction.NONE,
      label: 'None',
      icon: 'do_not_disturb',
      dividerAfter: true
    },
    { action: WorldEditorMenuAction.UPLOAD_FILE, label: 'Upload Map', icon: 'upload_file' }
  ];

  readonly selectedAction = signal<WorldEditorMenuAction>(WorldEditorMenuAction.PAN);
  readonly tagMetadata = signal<TagMetadata>({
    worldId: '',
    name: '',
    description: '',
    backstory: '',
    locationType: LocationType.City,
    color: '#ef4444',
    size: 20
  });

  readonly currentAction = computed<MapAction>(() => {
    const action = this.selectedAction();
    switch (action) {
      case WorldEditorMenuAction.PLACE_TAG:
        return {
          type: MapActionType.PLACE_TAG,
          metadata: this.tagMetadata()
        };
      case WorldEditorMenuAction.SELECT_TAG:
        return { type: MapActionType.SELECT_TAG };
      case WorldEditorMenuAction.PAN:
        return { type: MapActionType.PAN };
      default:
        return { type: MapActionType.NONE };
    }
  });

  readonly selectedTagId = signal<string | null>(null);

  readonly showTagEditor = computed(() => {
    const action = this.selectedAction();
    const selectedId = this.selectedTagId();
    return (
      action === WorldEditorMenuAction.PLACE_TAG ||
      (action === WorldEditorMenuAction.SELECT_TAG && selectedId !== null)
    );
  });

  ngOnInit(): void {
    // Initialize with mock map if no maps loaded
    if (this.mapFacade.mapList().length === 0) {
      // Manually add the first mock map
      const mockMap = MOCK_WORLD_MAPS[0];
      (this.mapFacade as any).maps.set([mockMap]);
      this.mapFacade.selectMap(mockMap.id);
    } else if (!this.mapFacade.activeMap()) {
      // Select first map if none active
      const firstMap = this.mapFacade.mapList()[0];
      this.mapFacade.selectMap(firstMap.id);
    }
  }

  onActionSelect(action: WorldEditorMenuAction): void {
    this.selectedAction.set(action);
  }

  onFileSelected(file: File): void {
    this.mapFacade.addMap({ name: file.name, imageUrl: '', layers: [], tags: [] }, file);
  }

  onTagMetadataChange(metadata: TagMetadata): void {
    this.tagMetadata.set(metadata);

    const selectedTagId = this.selectedTagId();
    if (selectedTagId && this.selectedAction() === WorldEditorMenuAction.SELECT_TAG) {
      this.mapEditor().renderer.updateTag(selectedTagId, {
        label: metadata.name,
        color: metadata.color,
        size: metadata.size,
        locationType: metadata.locationType
      });
    }
  }

  onTagSelect(tag: Tag | null): void {
    if (tag) {
      this.selectedTagId.set(tag.id);
      this.tagMetadata.set({
        worldId: '',
        name: tag.label,
        description: '',
        backstory: '',
        locationType: tag.locationType,
        color: tag.color,
        size: tag.size
      });
      this.selectedAction.set(WorldEditorMenuAction.SELECT_TAG);
    } else {
      this.selectedTagId.set(null);
    }
  }
}
