import { LocationType } from '../../../core/types/enums/location-type.enum';

export const LOCATION_ICON_PATHS: Record<LocationType, string> = {
  [LocationType.City]: '/icons/locations/city.svg',
  [LocationType.Dungeon]: '/icons/locations/dungeon.svg',
  [LocationType.Wilderness]: '/icons/locations/wilderness.svg',
  [LocationType.Other]: '/icons/locations/other.svg'
};
