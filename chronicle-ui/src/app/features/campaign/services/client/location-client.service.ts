import { Service, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Location } from '../../../../core/types/dtos/view/location-view.types';
import {
  CreateLocation,
  UpdateLocation
} from '../../../../core/types/dtos/write/location-write.types';
import { MOCK_LOCATIONS } from '../../../../core/testing/mocks/location.mocks';

@Service()
export class LocationClientService {
  private locations = signal<Location[]>(MOCK_LOCATIONS);

  getById(id: string): Observable<Location | undefined> {
    const location = this.locations().find(l => l.id === id);
    return of(location).pipe(delay(100));
  }

  create(data: CreateLocation): Observable<Location> {
    const newLocation: Location = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.locations.update(locations => [...locations, newLocation]);
    return of(newLocation).pipe(delay(100));
  }

  update(id: string, data: UpdateLocation): Observable<Location | undefined> {
    const index = this.locations().findIndex(l => l.id === id);
    if (index === -1) return of(undefined).pipe(delay(100));

    const updated: Location = {
      ...this.locations()[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.locations.update(locations => {
      const newLocations = [...locations];
      newLocations[index] = updated;
      return newLocations;
    });

    return of(updated).pipe(delay(100));
  }

  delete(id: string): Observable<boolean> {
    const index = this.locations().findIndex(l => l.id === id);
    if (index === -1) return of(false).pipe(delay(100));

    this.locations.update(locations => locations.filter(l => l.id !== id));
    return of(true).pipe(delay(100));
  }
}
