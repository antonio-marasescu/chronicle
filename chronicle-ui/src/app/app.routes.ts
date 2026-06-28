import { Routes } from '@angular/router';
import { AppRoutes } from './core/const/app-routes.constants';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.Home.Base
  },
  {
    path: AppRoutes.Home.Base,
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  }
];
