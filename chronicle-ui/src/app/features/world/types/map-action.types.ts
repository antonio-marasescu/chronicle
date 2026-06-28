export enum MapActionType {
  NONE = 'NONE',
  PLACE_TAG = 'PLACE_TAG'
}

export type PlaceTagMetadata = {
  color: string;
  size: number;
  label: string;
};

export type MapAction =
  | { type: MapActionType.NONE }
  | { type: MapActionType.PLACE_TAG; metadata: PlaceTagMetadata };
