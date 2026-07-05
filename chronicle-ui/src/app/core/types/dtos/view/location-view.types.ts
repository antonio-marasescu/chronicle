import { LocationType } from '../../enums/location-type.enum';
import { Point } from '../../math/point';

export type Location = {
  id: string;
  worldId: string;
  name: string;
  description: string;
  backstory: string;
  locationType: LocationType;
  color: string;
  size: number;
  coordinates?: Point;
  parentLocationId?: string;
  createdAt: string;
  updatedAt: string;
};
