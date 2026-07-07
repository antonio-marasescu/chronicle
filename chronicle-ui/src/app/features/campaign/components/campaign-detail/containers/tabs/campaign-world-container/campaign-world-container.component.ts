import { Component, computed, inject, input, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { CampaignWorldViewComponent } from '../../../views/tabs/campaign-world-view/campaign-world-view.component';
import { Campaign } from '../../../../../../../core/types/dtos/view/campaign-view.types';
import { MapStoreService } from '../../../../../../world/services/map/map-store.service';
import { WorldEditorMenuAction } from '../../../../../../world/types/world-editor-menu.types';
import { Location } from '../../../../../../../core/types/dtos/view/location-view.types';
import { TagMetadata } from '../../../../../../world/types/tag-metadata.types';
import {
  getDefaultTagMetadata,
  getWorldEditorMenuItems
} from '../../../../../utils/campaign-world.utils';

@Component({
  selector: 'app-campaign-world-container',
  imports: [CampaignWorldViewComponent],
  template: `
    <app-campaign-world-view
      [menuItems]="menuItems"
      [selectedAction]="selectedAction()"
      [tagMetadataForm]="tagMetadataForm"
      [showTagEditor]="showTagEditor()"
      (actionSelect)="onActionSelect($event)"
      (fileSelect)="onFileSelected($event)"
      (tagSelect)="onTagSelect($event)"
    />
  `
})
export class CampaignWorldContainerComponent {
  campaign = input.required<Campaign>();
  private readonly mapStore = inject(MapStoreService);
  protected readonly menuItems = getWorldEditorMenuItems();
  protected readonly selectedAction = signal<WorldEditorMenuAction>(WorldEditorMenuAction.PAN);
  protected readonly tagMetadataModel = signal<TagMetadata>(getDefaultTagMetadata(''));
  protected readonly tagMetadataForm = form(this.tagMetadataModel);
  protected readonly selectedTagId = signal<string | null>(null);
  protected readonly showTagEditor = computed(() => {
    const action = this.selectedAction();
    const selectedId = this.selectedTagId();

    return (
      action === WorldEditorMenuAction.PLACE_TAG ||
      (action === WorldEditorMenuAction.SELECT_TAG && selectedId !== null)
    );
  });

  onActionSelect(action: WorldEditorMenuAction): void {
    this.selectedAction.set(action);

    if (action === WorldEditorMenuAction.PLACE_TAG) {
      const campaign = this.campaign();
      this.tagMetadataModel.set(getDefaultTagMetadata(campaign.id));
      return;
    }

    if (action !== WorldEditorMenuAction.SELECT_TAG) {
      this.tagMetadataModel.set(getDefaultTagMetadata(''));
      this.selectedTagId.set(null);
      return;
    }
  }

  onFileSelected(file: File): void {
    const campaign = this.campaign();
    this.mapStore.addWorld(
      {
        campaignId: campaign.id,
        name: file.name,
        description: '',
        backstory: '',
        imageUrl: '',
        locationIds: []
      },
      file
    );
  }

  onTagSelect(location: Location | null): void {
    if (!location) {
      this.selectedTagId.set(null);
      return;
    }

    this.selectedTagId.set(location.id);
    this.tagMetadataModel.set({
      worldId: location.worldId,
      name: location.name,
      description: location.description,
      backstory: location.backstory,
      locationType: location.locationType,
      color: location.color,
      size: location.size
    });
    this.selectedAction.set(WorldEditorMenuAction.SELECT_TAG);
  }
}
