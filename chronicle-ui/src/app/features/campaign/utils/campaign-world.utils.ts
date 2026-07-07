import {
  WorldEditorMenuAction,
  WorldEditorMenuItem
} from '../../world/types/world-editor-menu.types';
import { TagMetadata } from '../../world/types/tag-metadata.types';
import { LocationType } from '../../../core/types/enums/location-type.enum';

export function getWorldEditorMenuItems(): WorldEditorMenuItem[] {
  return [
    { action: WorldEditorMenuAction.PAN, label: 'Pan', icon: 'pan_tool' },
    { action: WorldEditorMenuAction.SELECT_TAG, label: 'Select Tag', icon: 'touch_app' },
    { action: WorldEditorMenuAction.PLACE_TAG, label: 'Place Tag', icon: 'location_on' },
    {
      action: WorldEditorMenuAction.NONE,
      label: 'None',
      icon: 'do_not_disturb',
      dividerAfter: true
    },
    { action: WorldEditorMenuAction.UPLOAD_FILE, label: 'Upload Map', icon: 'upload_file' }
  ];
}

export function getDefaultTagMetadata(worldId: string): TagMetadata {
  return {
    worldId,
    name: '',
    description: '',
    backstory: '',
    locationType: LocationType.City,
    color: '#ef4444',
    size: 20
  };
}
