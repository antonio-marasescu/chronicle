import { Component } from '@angular/core';
import { CampaignNpcsViewComponent } from '../../../views/tabs/campaign-npcs-view/campaign-npcs-view.component';

@Component({
  selector: 'app-campaign-npcs-container',
  imports: [CampaignNpcsViewComponent],
  template: `<app-campaign-npcs-view />`
})
export class CampaignNpcsContainerComponent {}
