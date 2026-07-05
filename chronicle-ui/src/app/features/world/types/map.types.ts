export type Tag = {
  id: string;
  label: string;
  color: string;
  size: number;
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
