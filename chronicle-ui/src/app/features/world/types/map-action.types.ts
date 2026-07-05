export enum MapActionType {
  NONE = 'NONE',
  PAN = 'PAN',
  PLACE_TAG = 'PLACE_TAG'
}

export type PlaceTagMetadata = {
  color: string;
  size: number;
  label: string;
};

export type MapAction =
  | { type: MapActionType.NONE }
  | { type: MapActionType.PAN }
  | { type: MapActionType.PLACE_TAG; metadata: PlaceTagMetadata };
