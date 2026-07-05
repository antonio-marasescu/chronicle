import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../const/app-routes.constants';

@Service()
export class AppNavigationService {
  private readonly router = inject(Router);

  // Campaign routes
  navigateToCampaignList(): void {
    this.router.navigate([AppRoutes.Base, AppRoutes.Campaign.Base]);
  }

  navigateToCampaignDetail(id: string, tab?: string): void {
    const queryParams: Record<string, string> = {};
    if (tab) queryParams['tab'] = tab;
    this.router.navigate([AppRoutes.Base, AppRoutes.Campaign.Base, id], {
      queryParams: Object.keys(queryParams).length ? queryParams : undefined
    });
  }

  navigateToCampaignEdit(id: string, tab?: string): void {
    const queryParams: Record<string, string> = { mode: 'edit' };
    if (tab) queryParams['tab'] = tab;
    this.router.navigate([AppRoutes.Base, AppRoutes.Campaign.Base, id], { queryParams });
  }

  navigateToCampaignCreate(): void {
    this.router.navigate([AppRoutes.Base, AppRoutes.Campaign.Base, AppRoutes.Campaign.Create], {
      queryParams: { mode: 'create' }
    });
  }

  // Home routes
  navigateToHome(): void {
    this.router.navigate([AppRoutes.Base, AppRoutes.Home.Base]);
  }

  // World routes
  navigateToWorld(): void {
    this.router.navigate([AppRoutes.Base, AppRoutes.World.Base]);
  }
}
