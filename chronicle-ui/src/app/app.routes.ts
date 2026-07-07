import { Routes } from '@angular/router';
import { AppRoutes } from './core/const/app-routes.constants';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.Campaign.Base
  },
  {
    path: AppRoutes.Home.Base,
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: AppRoutes.Campaign.Base,
    loadChildren: () => import('./features/campaign/campaign.routes').then(m => m.CAMPAIGN_ROUTES)
  }
];
