import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CampaignWithWorld } from '../../../../../../core/types/dtos/view/campaign-view.types';
import { MapStoreService } from '../../../../../world/services/map/map-store.service';
import { AppNavigationService } from '../../../../../../core/services/app-navigation.service';
import { SwitchButtonComponent } from '../../../../../../core/components/switch-button/switch-button.component';
import { LoadingSpinnerComponent } from '../../../../../../core/components/loading-spinner/loading-spinner.component';
import { CampaignOverviewContainerComponent } from '../../containers/tabs/campaign-overview-container/campaign-overview-container.component';
import { CampaignWorldContainerComponent } from '../../containers/tabs/campaign-world-container/campaign-world-container.component';
import { CampaignChaptersContainerComponent } from '../../containers/tabs/campaign-chapters-container/campaign-chapters-container.component';
import { CampaignNpcsContainerComponent } from '../../containers/tabs/campaign-npcs-container/campaign-npcs-container.component';
import {
  CampaignDetailTabsViewComponent,
  type TabType
} from '../../views/general/campaign-detail-tabs-view/campaign-detail-tabs-view.component';
import { CampaignDetailMode } from '../../../../types/campaign-detail.types';

@Component({
  selector: 'app-campaign-detail',
  imports: [
    SwitchButtonComponent,
    LoadingSpinnerComponent,
    CampaignDetailTabsViewComponent,
    CampaignOverviewContainerComponent,
    CampaignWorldContainerComponent,
    CampaignChaptersContainerComponent,
    CampaignNpcsContainerComponent
  ],
  templateUrl: './campaign-detail-page.component.html'
})
export class CampaignDetailPageComponent {
  private readonly navigation = inject(AppNavigationService);
  private readonly mapStore = inject(MapStoreService);

  campaign = input<CampaignWithWorld | undefined>();
  id = input<string | undefined>();
  tab = input.required({
    transform: (value: TabType | undefined): TabType => value ?? 'overview'
  });
  mode = input.required({
    transform: (value: CampaignDetailMode | undefined): CampaignDetailMode =>
      value ?? CampaignDetailMode.View
  });
  protected readonly CampaignDetailMode = CampaignDetailMode;
  protected readonly isEditMode = computed(() => this.mode() === CampaignDetailMode.Edit);
  protected readonly isLoaded = computed(
    () => this.mode() === CampaignDetailMode.Create || this.campaign() !== undefined
  );

  constructor() {
    effect(() => {
      const campaign = this.campaign();
      if (campaign?.world) {
        this.mapStore.setWorlds([campaign.world]);
        this.mapStore.selectWorld(campaign.world.id);
      }
    });
  }

  protected navigateToTab(tab: TabType): void {
    const campaignId = this.id();
    if (campaignId) {
      if (this.mode() === CampaignDetailMode.Edit) {
        this.navigation.navigateToCampaignEdit(campaignId, tab);
      } else {
        this.navigation.navigateToCampaignDetail(campaignId, tab);
      }
    }
  }

  protected onEditModeChange(editMode: boolean): void {
    const campaignId = this.id();
    if (!campaignId) return;

    if (editMode) {
      this.navigation.navigateToCampaignEdit(campaignId, this.tab());
    } else {
      this.navigation.navigateToCampaignDetail(campaignId, this.tab());
    }
  }

  protected onBack(): void {
    this.navigation.navigateToCampaignList();
  }

  protected onCancel(): void {
    if (this.mode() === CampaignDetailMode.Create) {
      this.navigation.navigateToCampaignList();
    } else {
      // Navigate back to view mode
      const campaignId = this.id();
      if (campaignId) {
        this.navigation.navigateToCampaignDetail(campaignId, this.tab());
      }
    }
  }

  protected onSave(): void {
    // TODO: Implement save logic
    console.log('Save campaign', this.mode());
    if (this.mode() === CampaignDetailMode.Create) {
      // Navigate to list after create
      this.navigation.navigateToCampaignList();
    } else {
      // Navigate back to view mode after save
      const campaignId = this.id();
      if (campaignId) {
        this.navigation.navigateToCampaignDetail(campaignId, this.tab());
      }
    }
  }
}
