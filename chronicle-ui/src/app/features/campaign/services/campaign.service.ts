import { inject, Signal, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CampaignClientService } from './client/campaign-client.service';

@Service()
export class CampaignService {
  private readonly client = inject(CampaignClientService);

  /**
   * Load a campaign by ID using Angular's rxResource API
   */
  getCampaignById(idSignal: Signal<string | undefined>) {
    return rxResource({
      params: () => idSignal(),
      stream: ({ params: id }) => {
        if (!id) return of(undefined);
        return this.client.getById(id);
      }
    });
  }

  /**
   * Load all campaigns using Angular's rxResource API
   */
  getAllCampaigns() {
    return rxResource({
      stream: () => this.client.getAll()
    });
  }

  /**
   * Direct Observable method for resolvers that need to load data
   * Resolvers require Observables, so we expose the client method directly
   */
  getById(id: string) {
    return this.client.getById(id);
  }

  /**
   * Direct client methods for mutations (create/update/delete)
   * These typically don't use resource API as they're one-time operations
   */
  create(data: Parameters<CampaignClientService['create']>[0]) {
    return this.client.create(data);
  }

  update(id: string, data: Parameters<CampaignClientService['update']>[1]) {
    return this.client.update(id, data);
  }

  delete(id: string) {
    return this.client.delete(id);
  }
}
