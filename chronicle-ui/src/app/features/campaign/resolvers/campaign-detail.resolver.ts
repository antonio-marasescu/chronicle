import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { CampaignWithWorld } from '../../../core/types/dtos/view/campaign-view.types';
import { CampaignService } from '../services/campaign.service';
import { WorldClientService } from '../services/client/world-client.service';
import { Observable, switchMap, map, of } from 'rxjs';

export const campaignDetailResolver: ResolveFn<CampaignWithWorld | undefined> = (
  route: ActivatedRouteSnapshot
): Observable<CampaignWithWorld | undefined> => {
  const campaignService = inject(CampaignService);
  const worldClient = inject(WorldClientService);
  const id = route.paramMap.get('id');

  if (!id) return of(undefined);

  return campaignService.getById(id).pipe(
    switchMap(campaign => {
      if (!campaign) return of(undefined);

      return worldClient.getById(campaign.worldId).pipe(
        map(world => ({
          ...campaign,
          world: world ?? null
        }))
      );
    })
  );
};
