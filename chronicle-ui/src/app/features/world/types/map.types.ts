import { LocationType } from '../../../core/types/enums/location-type.enum';

export type Tag = {
  id: string;
  label: string;
  color: string;
  size: number;
  locationType: LocationType;
  x: number;
  y: number;
};

export type MapLayer = {
  id: string;
  name: string;
  imageUrl: string;
  visible: boolean;
};

export type WorldMap = {
  id: string;
  name: string;
  imageUrl: string;
  layers: MapLayer[];
  tags: Tag[];
};
