import { Component, input } from '@angular/core';
import { Campaign } from '../../../../../../../core/types/dtos/view/campaign-view.types';
import { CampaignOverviewViewComponent } from '../../../views/tabs/campaign-overview-view/campaign-overview-view.component';

@Component({
  selector: 'app-campaign-overview-container',
  imports: [CampaignOverviewViewComponent],
  template: `<app-campaign-overview-view [campaign]="campaign()" [editMode]="editMode()" />`
})
export class CampaignOverviewContainerComponent {
  campaign = input.required<Campaign>();
  editMode = input(false);
}
