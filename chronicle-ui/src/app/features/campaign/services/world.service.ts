import { inject, Signal, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { WorldClientService } from './client/world-client.service';

@Service()
export class WorldService {
  private readonly client = inject(WorldClientService);

  /**
   * Load a world by ID using Angular's rxResource API
   */
  getWorldById(idSignal: Signal<string | undefined>) {
    return rxResource({
      params: () => idSignal(),
      stream: ({ params: id }) => {
        if (!id) return of(undefined);
        return this.client.getById(id);
      }
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
  create(campaignId: string, data: Parameters<WorldClientService['create']>[1]) {
    return this.client.create(campaignId, data);
  }

  update(id: string, data: Parameters<WorldClientService['update']>[1]) {
    return this.client.update(id, data);
  }

  delete(id: string) {
    return this.client.delete(id);
  }
}
