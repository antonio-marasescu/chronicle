import { Service, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Campaign } from '../../../../core/types/dtos/view/campaign-view.types';
import {
  CreateCampaign,
  UpdateCampaign
} from '../../../../core/types/dtos/write/campaign-write.types';
import { MOCK_CAMPAIGNS } from '../../../../core/testing/mocks/campaign.mocks';

@Service()
export class CampaignClientService {
  private campaigns = signal<Campaign[]>(MOCK_CAMPAIGNS);

  getAll(): Observable<Campaign[]> {
    return of(this.campaigns()).pipe(delay(100));
  }

  getById(id: string): Observable<Campaign | undefined> {
    const campaign = this.campaigns().find(c => c.id === id);
    return of(campaign).pipe(delay(100));
  }

  create(data: CreateCampaign): Observable<Campaign> {
    const newCampaign: Campaign = {
      ...data,
      id: crypto.randomUUID(),
      worldId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.campaigns.update(campaigns => [...campaigns, newCampaign]);
    return of(newCampaign).pipe(delay(100));
  }

  update(id: string, data: UpdateCampaign): Observable<Campaign | undefined> {
    const index = this.campaigns().findIndex(c => c.id === id);
    if (index === -1) return of(undefined).pipe(delay(100));

    const updated: Campaign = {
      ...this.campaigns()[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.campaigns.update(campaigns => {
      const newCampaigns = [...campaigns];
      newCampaigns[index] = updated;
      return newCampaigns;
    });

    return of(updated).pipe(delay(100));
  }

  delete(id: string): Observable<boolean> {
    const index = this.campaigns().findIndex(c => c.id === id);
    if (index === -1) return of(false).pipe(delay(100));

    this.campaigns.update(campaigns => campaigns.filter(c => c.id !== id));
    return of(true).pipe(delay(100));
  }
}
