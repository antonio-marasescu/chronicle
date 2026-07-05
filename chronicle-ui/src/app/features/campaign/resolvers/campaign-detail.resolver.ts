import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Campaign } from '../../../core/types/dtos/view/campaign-view.types';
import { CampaignService } from '../services/campaign.service';

export const campaignDetailResolver: ResolveFn<Campaign | undefined> = (
  route: ActivatedRouteSnapshot
) => {
  const campaignService = inject(CampaignService);
  const id = route.paramMap.get('id');

  return id ? campaignService.getById(id) : undefined;
};
