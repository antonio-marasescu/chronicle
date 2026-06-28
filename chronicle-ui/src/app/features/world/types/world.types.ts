export type MapEditorMode = 'readonly' | 'edit';

export type MapClickEvent = {
  x: number;
  y: number;
};

export type Tag = {
  id: string;
  label: string;
  color: string;
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
