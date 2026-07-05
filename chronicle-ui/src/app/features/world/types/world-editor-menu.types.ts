export enum WorldEditorMenuAction {
  PAN = 'pan',
  PLACE_TAG = 'place_tag',
  NONE = 'none',
  UPLOAD_FILE = 'upload_file'
}

export type WorldEditorMenuItem = {
  action: WorldEditorMenuAction;
  icon: string;
  label: string;
  dividerAfter?: boolean;
};
