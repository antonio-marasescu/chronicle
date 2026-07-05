import { Component } from '@angular/core';
import { CampaignChaptersViewComponent } from '../../../views/tabs/campaign-chapters-view/campaign-chapters-view.component';

@Component({
  selector: 'app-campaign-chapters-container',
  imports: [CampaignChaptersViewComponent],
  template: `<app-campaign-chapters-view />`
})
export class CampaignChaptersContainerComponent {}
