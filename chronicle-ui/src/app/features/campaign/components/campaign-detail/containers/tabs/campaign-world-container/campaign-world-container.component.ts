import { Component } from '@angular/core';
import { CampaignWorldViewComponent } from '../../../views/tabs/campaign-world-view/campaign-world-view.component';

@Component({
  selector: 'app-campaign-world-container',
  imports: [CampaignWorldViewComponent],
  template: `<app-campaign-world-view />`
})
export class CampaignWorldContainerComponent {}
