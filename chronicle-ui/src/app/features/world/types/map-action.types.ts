import { CreateLocation } from '../../../core/types/dtos/write/location-write.types';

export enum MapActionType {
  NONE = 'NONE',
  PAN = 'PAN',
  PLACE_TAG = 'PLACE_TAG',
  SELECT_TAG = 'SELECT_TAG'
}

export type MapAction =
  | { type: MapActionType.NONE }
  | { type: MapActionType.PAN }
  | { type: MapActionType.PLACE_TAG; metadata: CreateLocation }
  | { type: MapActionType.SELECT_TAG };
