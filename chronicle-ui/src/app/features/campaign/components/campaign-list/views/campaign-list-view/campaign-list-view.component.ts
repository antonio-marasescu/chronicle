import { Component, input, output } from '@angular/core';
import { Campaign } from '../../../../../../core/types/dtos/view/campaign-view.types';

@Component({
  selector: 'app-campaign-list-view',
  imports: [],
  templateUrl: './campaign-list-view.component.html'
})
export class CampaignListViewComponent {
  campaigns = input.required<Campaign[]>();
  viewCampaign = output<string>();
  editCampaign = output<string>();
}
