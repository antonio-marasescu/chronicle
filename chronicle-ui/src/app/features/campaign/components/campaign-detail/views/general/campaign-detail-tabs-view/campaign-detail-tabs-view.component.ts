import { Component, input, output } from '@angular/core';

export type TabType = 'overview' | 'world' | 'chapters' | 'npcs';

@Component({
  selector: 'app-campaign-detail-tabs-view',
  imports: [],
  templateUrl: './campaign-detail-tabs-view.component.html'
})
export class CampaignDetailTabsViewComponent {
  activeTab = input.required<TabType>();
  tabChange = output<TabType>();
}
