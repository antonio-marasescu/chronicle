# Campaign Map Frontend

Interactive map editor and viewer for worlds, allowing DMs to import map images and place labeled markers (places) that can hold notes and details.

## Core Concepts

- **Map**: A large image (world map, region map, dungeon) associated with a world
- **Place**: A pin/marker placed at specific coordinates on the map, with a label and icon type
- **Edit Mode**: DM can import images, add/move/delete places, and edit place notes
- **Preview Mode**: Read-only view where clicking a place opens its notes for reading

## Scope

**In scope (v1):**
- Import a local image as the map background
- Pan and zoom navigation (large maps)
- Add place markers at specific coordinates
- Place markers have a label and an icon type (city, tavern, dungeon, etc.)
- Move and delete existing places
- Click a place to open a notes panel (edit mode: editable, preview mode: read-only)
- Toggle between edit and preview modes

**Out of scope (future):**
- S3 persistence / backend storage of map images
- Multiple maps per world
- Region/polygon areas
- Layers or fog of war
- Real-time collaborative editing
- Integration into campaign/world detail views (will be imported later)

## Use Cases

**Import a map image**
- DM opens the map editor in edit mode
- Selects a local image file (PNG, JPG, WebP)
- Image renders as the map background in the PixiJS canvas
- Map supports pan/zoom for navigation on large images

**Add a place**
- DM clicks on a location on the map (edit mode)
- A form appears to set the place label and icon type
- Place marker appears at the clicked coordinates
- Place is stored in local state

**Edit a place**
- DM clicks an existing place marker (edit mode)
- A side panel/tab opens with the place details
- DM can edit label, icon, and notes
- DM can drag the marker to reposition it

**Delete a place**
- DM selects a place marker (edit mode)
- Delete action removes the marker from the map

**Preview a place**
- User clicks a place marker (preview mode)
- A side panel/tab opens showing the place notes (read-only)

## Frontend

**Feature module**: `/features/map-editor`

**Components:**
- `MapEditorComponent` — Container component, manages edit/preview mode toggle
- `MapCanvasComponent` — PixiJS canvas handling image rendering, pan/zoom, marker rendering
- `PlaceFormComponent` — Form for creating/editing a place (label, icon type, notes)
- `PlacePanelComponent` — Side panel showing place details (edit or read-only based on mode)

**Services:**
- `MapEditorService` — State management for the map (image data, places list, selected place, current mode)

**Types:**
- `MapPlace` — id, label, icon type, x/y coordinates, notes content
- `MapEditorMode` — `'edit' | 'preview'`
- `PlaceIconType` — union of available icon types (city, tavern, dungeon, forest, mountain, etc.)

**PixiJS usage:**
- Render imported image as a large sprite
- Pan/zoom via pointer events (drag to pan, scroll/pinch to zoom)
- Place markers rendered as interactive sprites/graphics on top of the map
- Markers respond to click (open panel) and drag (reposition, edit mode only)

## Technical Considerations

- **Large images**: PixiJS handles large textures well but may need tiling or downscaling for extremely large images (>8192px). Start simple, optimize if needed.
- **Local-only state (v1)**: All map data lives in the Angular service's signals. No API calls yet. Structure the state so it can be serialized to an API payload later.
- **Coordinate system**: Store place positions as percentage-based coordinates (0-1 range) relative to image dimensions, so they remain valid if the image is resized or displayed at different zoom levels.
- **Future integration**: This feature module will be imported into campaign/world detail views later. Keep it self-contained with clear inputs (map data) and outputs (change events).

## Related Features

- **Worlds** — Maps belong to worlds; this feature will integrate into world detail views
- **Campaigns** — Campaigns reference worlds and their maps
