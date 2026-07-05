import { Routes } from '@angular/router';
import { campaignDetailResolver } from './resolvers/campaign-detail.resolver';

export const CAMPAIGN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/campaign-list/pages/campaign-list-page/campaign-list-page.component').then(
        m => m.CampaignListPageComponent
      )
  },
  {
    path: 'create',
    resolve: {
      campaign: campaignDetailResolver
    },
    loadComponent: () =>
      import('./components/campaign-detail/pages/campaign-detail-page/campaign-detail-page.component').then(
        m => m.CampaignDetailPageComponent
      )
  },
  {
    path: ':id',
    resolve: {
      campaign: campaignDetailResolver
    },
    loadComponent: () =>
      import('./components/campaign-detail/pages/campaign-detail-page/campaign-detail-page.component').then(
        m => m.CampaignDetailPageComponent
      )
  }
];
