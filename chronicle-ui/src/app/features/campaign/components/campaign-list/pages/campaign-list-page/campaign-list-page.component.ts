import { Component, inject } from '@angular/core';
import { CampaignService } from '../../../../services/campaign.service';
import { AppNavigationService } from '../../../../../../core/services/app-navigation.service';
import { LoadingSpinnerComponent } from '../../../../../../core/components/loading-spinner/loading-spinner.component';
import { CampaignListViewComponent } from '../../views/campaign-list-view/campaign-list-view.component';

@Component({
  selector: 'app-campaign-list',
  imports: [LoadingSpinnerComponent, CampaignListViewComponent],
  templateUrl: './campaign-list-page.component.html'
})
export class CampaignListPageComponent {
  private readonly campaignService = inject(CampaignService);
  private readonly navigation = inject(AppNavigationService);

  protected readonly campaignsResource = this.campaignService.getAllCampaigns();
  protected readonly campaigns = this.campaignsResource.value;
  protected readonly isLoading = this.campaignsResource.isLoading;

  protected onViewCampaign(id: string): void {
    this.navigation.navigateToCampaignDetail(id);
  }

  protected onEditCampaign(id: string): void {
    this.navigation.navigateToCampaignDetail(id);
  }

  protected onCreateCampaign(): void {
    this.navigation.navigateToCampaignCreate();
  }
}
