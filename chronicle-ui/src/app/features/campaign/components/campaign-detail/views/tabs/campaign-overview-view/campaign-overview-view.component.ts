import { Component, input } from '@angular/core';
import { Campaign } from '../../../../../../../core/types/dtos/view/campaign-view.types';

@Component({
  selector: 'app-campaign-overview-view',
  imports: [],
  templateUrl: './campaign-overview-view.component.html'
})
export class CampaignOverviewViewComponent {
  campaign = input.required<Campaign>();
  editMode = input(false);
}
