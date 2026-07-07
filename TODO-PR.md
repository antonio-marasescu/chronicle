# TODO PR feature/map-editor

## Completed ✓

### Three.js Migration
- ✓ Migrated from Canvas API to Three.js (WebGL) renderer
  - ✓ Installed Three.js (v0.185.1) and @types/three
  - ✓ Removed PixiJS dependency (was unused)
  - ✓ Created MapRendererService (Three.js-based) with:
    - WebGLRenderer with antialiasing
    - OrthographicCamera for 2D view
    - OrbitControls for automatic pan/zoom
    - Raycaster for precise hover/click detection
    - TagObject class (THREE.Group) for tags
    - Automatic frustum culling (tags hidden when zoom > 3.0x)
    - Automatic canvas resizing
    - Icon texture caching
  - ✓ Removed old Canvas-based MapRendererService
  - ✓ Updated MapEditorComponent for Three.js
  - ✓ Updated MapActionService to use new renderer
  - ✓ All features preserved: pan, zoom, tag placement, selection, hover
  
**Benefits:**
- Better performance via WebGL acceleration
- Automatic viewport culling (no manual coordinate transforms)
- Built-in camera system with smooth controls
- Foundation for future 3D features (terrain, elevation, etc.)
- Cleaner architecture (scene graph vs manual rendering)

### Initial Requirements
- ✓ Fixed map canvas displacement when tag editor is shown
  - Removed absolute positioning from canvas
  - Tag editor now always reserves space (invisible when not in use)
  - Map maintains static size regardless of editor visibility
- ✓ Implemented tag selection with visual highlight (blue border) and editing
  - Added SELECT_TAG action type and menu item
  - Tags can now be clicked to select them
  - Selected tags populate the tag editor with their properties
  - Tag properties update in real-time when editing a selected tag
  - Added cursor styles per action mode (grab/pointer/crosshair)
- ✓ Improved visual design of campaign world view
  - Enhanced menu button styling with transitions and shadows
  - Improved tag editor with Material Icons and better spacing
  - Added background colors and better borders
  - Enhanced preview panel styling

### UI Size Improvements
- ✓ Increased action menu button sizes
  - Changed from `btn-sm` (small) to `btn-md` (medium)
  - Icon size increased from `text-lg` to `text-2xl`
  - Menu width increased from `w-16` (64px) to `w-20` (80px)
  - Spacing increased (gap-3, p-4)
- ✓ Increased location settings form sizes
  - Panel width increased from `w-80` (320px) to `w-96` (384px)
  - All inputs changed from `input-sm` to `input-md`
  - Labels now `text-base font-medium` for better readability
  - Header increased to `text-xl` with larger icon (`text-2xl`)
  - Section headers increased to `text-base` with `text-xl` icons
  - Textareas taller (h-24, h-28) with medium sizing
  - Color picker increased to `w-16 h-12`
  - Range slider changed to `range-md`
  - Preview text increased to `text-base`
  - Increased padding and spacing throughout (p-6, space-y-4)

### Additional Improvements
- ✓ Fixed SVG icon loading (moved to public folder)
  - Icons now load correctly from `/icons/locations/`
  - Updated paths in renderer and tag editor
- ✓ Significantly increased tag sizes
  - Size range increased from 4-20px to 12-40px
  - Default size increased from 8px to 20px
  - Tags render at 1.5x multiplier (effective 18-60px range)
  - Updated mock data to use new size range
- ✓ Increased text size and improved readability
  - Minimum 14px font size, scales up to 16px+ with zoom
  - Changed to bold font weight
  - Labels always visible (removed zoom requirement)
  - Better text stroke for contrast (4px width)
- ✓ Added hover effects for tags
  - Tags scale up 15% on hover
  - White glow ring around hovered tags
  - Drop shadow effect on hover
  - Hover state tracked and rendered
  - Cursor changes appropriately
  - Hover detection in SELECT_TAG and NONE modes

**See IMPROVEMENTS.md for detailed technical documentation**