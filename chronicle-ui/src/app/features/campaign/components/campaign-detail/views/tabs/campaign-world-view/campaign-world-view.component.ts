import { Component, input, output } from '@angular/core';
import { MapEditorComponent } from '../../../../../../world/components/map/map-editor.component';
import { WorldEditorMenuComponent } from '../../../../../../world/components/world/world-editor-menu.component';
import { WorldTagEditorComponent } from '../../../../../../world/components/world/world-tag-editor.component';
import {
  WorldEditorMenuAction,
  WorldEditorMenuItem
} from '../../../../../../world/types/world-editor-menu.types';
import { Location } from '../../../../../../../core/types/dtos/view/location-view.types';
import { TagMetadataForm } from '../../../../../../world/types/tag-metadata.types';

@Component({
  selector: 'app-campaign-world-view',
  imports: [MapEditorComponent, WorldEditorMenuComponent, WorldTagEditorComponent],
  templateUrl: './campaign-world-view.component.html'
})
export class CampaignWorldViewComponent {
  menuItems = input.required<WorldEditorMenuItem[]>();
  selectedAction = input.required<WorldEditorMenuAction>();
  tagMetadataForm = input.required<TagMetadataForm>();
  showTagEditor = input.required<boolean>();

  actionSelect = output<WorldEditorMenuAction>();
  fileSelect = output<File>();
  tagSelect = output<Location | null>();
}
