import { Injectable, signal } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Location } from '../../../../core/types/dtos/view/location-view.types';
import { MapActionType } from '../../types/map-action.types';
import { LocationType } from '../../../../core/types/enums/location-type.enum';
import { MAX_ZOOM, MIN_ZOOM } from '../../world.constants';
import { LOCATION_ICON_PATHS } from '../../types/map-render.types';

class TagObject extends THREE.Group {
  public tagId: string;
  private circle: THREE.Mesh;
  private icon: THREE.Sprite | null = null;
  private label: THREE.Sprite | null = null;

  constructor(location: Location, iconTexture: THREE.Texture | null) {
    super();
    this.tagId = location.id;
    this.layers.set(1); // TAGS_LAYER

    // Create circle background
    this.circle = this.createCircle(location.size, location.color);
    this.add(this.circle);

    // Create icon sprite
    console.log('Creating tag with icon:', location.locationType, 'texture:', iconTexture);
    if (iconTexture) {
      this.icon = this.createIconSprite(iconTexture, location.size);
      this.add(this.icon);
      console.log('Icon sprite created and added');
    } else {
      console.warn('No icon texture available for tag:', location.id);
    }

    // Create label
    if (location.name) {
      this.label = this.createLabel(location.name, location.size);
      this.add(this.label);
    }

    // Position in world coordinates
    const x = location.coordinates?.x ?? 0;
    const y = location.coordinates?.y ?? 0;
    this.position.set(x, y, 1);
  }

  private createCircle(size: number, color: string): THREE.Mesh {
    const geometry = new THREE.CircleGeometry(size, 32);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    // Make sure the mesh can be raycast
    mesh.userData['isTagCircle'] = true;
    return mesh;
  }

  private createIconSprite(texture: THREE.Texture, size: number): THREE.Sprite {
    const material = new THREE.SpriteMaterial({
      map: texture,
      sizeAttenuation: true // Scale with world coordinates
    });

    const sprite = new THREE.Sprite(material);
    // Scale to match circle size in world units
    sprite.scale.set(size * 1.3, size * 1.3, 1);
    sprite.position.z = 0.1; // Slightly in front of circle
    return sprite;
  }

  private createLabel(text: string, size: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
    ctx.strokeText(text, 128, 32);
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      sizeAttenuation: true
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.y = -size - 10;
    sprite.position.z = 0.1; // In front of circle
    sprite.scale.set(size * 4, size, 1); // Width proportional to text

    return sprite;
  }

  setSelected(selected: boolean): void {
    const existingRing = this.getObjectByName('selection-ring');
    if (existingRing) this.remove(existingRing);

    if (selected) {
      const circleGeometry = this.circle.geometry as THREE.CircleGeometry;
      const radius = circleGeometry.parameters.radius;
      const ring = new THREE.RingGeometry(radius + 2, radius + 4, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ring, ringMaterial);
      ringMesh.name = 'selection-ring';
      this.add(ringMesh);
    }
  }

  setHovered(hovered: boolean): void {
    if (hovered) {
      this.scale.set(1.15, 1.15, 1.15);
    } else {
      this.scale.set(1, 1, 1);
    }
  }
}

@Injectable()
export class MapRendererService {
  readonly initialized = signal(false);
  readonly tags = signal<Location[]>([]);
  readonly zoom = signal(MIN_ZOOM);
  readonly selectedTagId = signal<string | null>(null);
  readonly hoveredTagId = signal<string | null>(null);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private controls!: OrbitControls;
  private raycaster!: THREE.Raycaster;
  private currentHoveredTag: TagObject | null = null;
  private iconTextureCache = new Map<LocationType, THREE.Texture>();
  private animationFrameId: number | null = null;
  private currentActionType: MapActionType = MapActionType.NONE;

  private readonly MAP_LAYER = 0;
  private readonly TAGS_LAYER = 1;

  constructor() {
    this.preloadIcons();
  }

  private preloadIcons(): void {
    Object.entries(LOCATION_ICON_PATHS).forEach(([type, path]) => {
      // Load SVG as an Image, then convert to canvas texture
      const img = new Image();
      img.onload = () => {
        // Create a canvas and draw the SVG image
        const canvas = document.createElement('canvas');
        const size = 128; // Icon resolution
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, size, size);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        this.iconTextureCache.set(type as LocationType, texture);
        console.log(`Icon loaded: ${type} from ${path}`);
      };
      img.onerror = error => {
        console.error(`Failed to load icon: ${type} from ${path}`, error);
      };
      img.src = path;
    });
  }

  initialize(canvas: HTMLCanvasElement): void {
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Set initial canvas size from parent
    const parent = canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      this.renderer.setSize(rect.width, rect.height, false);
    }

    // Setup orthographic camera for 2D view
    const rect = canvas.parentElement?.getBoundingClientRect();
    const aspect = rect ? rect.width / rect.height : 1;
    const frustumSize = 1000;
    this.camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    );
    this.camera.position.z = 500;

    // Enable camera to see all layers
    this.camera.layers.enableAll();

    // Setup controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableRotate = false;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: null as unknown as THREE.MOUSE
    };
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.zoomSpeed = 1.2;
    this.controls.minZoom = MIN_ZOOM;
    this.controls.maxZoom = MAX_ZOOM;

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf3f4f6);

    // Setup raycaster for picking
    this.raycaster = new THREE.Raycaster();
    // Enable all layers for raycasting
    this.raycaster.layers.enableAll();

    // Setup event handlers
    this.setupEventHandlers(canvas);

    this.initialized.set(true);

    // Start render loop
    this.animate();
  }

  loadImage(url: string): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(url, texture => {
      const aspect = texture.image.width / texture.image.height;
      const width = 1000;
      const height = width / aspect;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });

      const mapMesh = new THREE.Mesh(geometry, material);
      mapMesh.layers.set(this.MAP_LAYER);

      // Remove old map if exists
      const oldMap = this.scene.getObjectByName('map');
      if (oldMap) this.scene.remove(oldMap);

      mapMesh.name = 'map';
      this.scene.add(mapMesh);

      // Fit camera to map
      this.fitCameraToMap(width, height);
      this.zoom.set(MIN_ZOOM);

      // Re-render existing tags on the new map
      this.renderAllTags();
    });
  }

  private renderAllTags(): void {
    // Remove all existing tag objects from scene
    const existingTags = this.scene.children.filter(child => child.name?.startsWith('tag-'));
    existingTags.forEach(tag => this.scene.remove(tag));

    // Add all tags from signal
    this.tags().forEach(location => {
      const iconTexture = this.iconTextureCache.get(location.locationType) ?? null;
      const tagObject = new TagObject(location, iconTexture);
      tagObject.name = `tag-${location.id}`;
      this.scene.add(tagObject);

      if (this.selectedTagId() === location.id) {
        tagObject.setSelected(true);
      }
    });
  }

  addTag(location: Location): void {
    this.tags.update(tags => [...tags, location]);
    const iconTexture = this.iconTextureCache.get(location.locationType) ?? null;
    const tagObject = new TagObject(location, iconTexture);
    tagObject.name = `tag-${location.id}`;
    this.scene.add(tagObject);
  }

  selectTag(tagId: string | null): void {
    const previousSelectedId = this.selectedTagId();
    if (previousSelectedId) {
      const prevTag = this.scene.getObjectByName(`tag-${previousSelectedId}`) as TagObject;
      if (prevTag) prevTag.setSelected(false);
    }

    this.selectedTagId.set(tagId);

    if (tagId) {
      const tagObject = this.scene.getObjectByName(`tag-${tagId}`) as TagObject;
      if (tagObject) tagObject.setSelected(true);
    }
  }

  setHoveredTag(tagId: string | null): void {
    if (this.hoveredTagId() === tagId) return;

    if (this.currentHoveredTag) {
      this.currentHoveredTag.setHovered(false);
    }

    this.hoveredTagId.set(tagId);

    if (tagId) {
      const tagObject = this.scene.getObjectByName(`tag-${tagId}`) as TagObject;
      if (tagObject) {
        tagObject.setHovered(true);
        this.currentHoveredTag = tagObject;
      } else {
        this.currentHoveredTag = null;
      }
    } else {
      this.currentHoveredTag = null;
    }
  }

  getTagAt(clientX: number, clientY: number): Location | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    for (const intersect of intersects) {
      const parent = this.findTagParent(intersect.object);
      if (parent instanceof TagObject) {
        const location = this.tags().find(t => t.id === parent.tagId);
        return location ?? null;
      }
    }
    return null;
  }

  updateTag(tagId: string, updates: Partial<Omit<Location, 'id'>>): void {
    this.tags.update(tags =>
      tags.map(tag =>
        tag.id === tagId ? { ...tag, ...updates, updatedAt: new Date().toISOString() } : tag
      )
    );

    const tagObject = this.scene.getObjectByName(`tag-${tagId}`) as TagObject;
    if (tagObject) {
      this.scene.remove(tagObject);
      const updatedTag = this.tags().find(t => t.id === tagId);
      if (updatedTag) {
        const iconTexture = this.iconTextureCache.get(updatedTag.locationType) ?? null;
        const newTagObject = new TagObject(updatedTag, iconTexture);
        newTagObject.name = `tag-${tagId}`;
        this.scene.add(newTagObject);

        if (this.selectedTagId() === tagId) {
          newTagObject.setSelected(true);
        }
        if (this.hoveredTagId() === tagId) {
          newTagObject.setHovered(true);
          this.currentHoveredTag = newTagObject;
        }
      }
    }
  }

  zoomAt(direction: 1 | -1, cursorX: number, cursorY: number): void {
    // OrbitControls handles zoom automatically through mouse wheel
    // This method is kept for API compatibility
  }

  pan(deltaX: number, deltaY: number): void {
    // OrbitControls handles panning automatically
    // This method is kept for API compatibility
  }

  getCanvasCoordinates(event: MouseEvent): { x: number; y: number } | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    vector.unproject(this.camera);

    return { x: vector.x, y: vector.y };
  }

  clear(): void {
    // Remove all tags from scene
    this.tags().forEach(tag => {
      const tagObject = this.scene.getObjectByName(`tag-${tag.id}`);
      if (tagObject) this.scene.remove(tagObject);
    });

    // Remove map
    const mapObject = this.scene.getObjectByName('map');
    if (mapObject) this.scene.remove(mapObject);

    this.tags.set([]);
    this.zoom.set(MIN_ZOOM);
    this.selectedTagId.set(null);
    this.hoveredTagId.set(null);
    this.currentHoveredTag = null;
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.clear();
    this.controls.dispose();
    this.renderer.dispose();
    this.initialized.set(false);
  }

  setActionType(actionType: MapActionType): void {
    this.currentActionType = actionType;

    // Disable controls when placing tags or selecting
    if (actionType === MapActionType.PLACE_TAG || actionType === MapActionType.SELECT_TAG) {
      this.controls.enabled = false;
    } else {
      this.controls.enabled = true;
    }

    // Update cursor
    const canvas = this.renderer.domElement;
    if (actionType === MapActionType.PAN) {
      canvas.style.cursor = 'grab';
    } else if (actionType === MapActionType.PLACE_TAG) {
      canvas.style.cursor = 'crosshair';
    } else if (actionType === MapActionType.SELECT_TAG) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  private fitCameraToMap(width: number, height: number): void {
    const aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    const frustumHeight = Math.max(height, width / aspect);

    this.camera.top = frustumHeight / 2;
    this.camera.bottom = -frustumHeight / 2;
    this.camera.left = (-frustumHeight * aspect) / 2;
    this.camera.right = (frustumHeight * aspect) / 2;
    this.camera.updateProjectionMatrix();

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private updateTagVisibility(): void {
    const zoomLevel = this.getZoomLevel();

    // Hide tags when zoomed in too close
    const shouldShowTags = zoomLevel < 3.0;

    this.scene.traverse(object => {
      if (object.layers.isEnabled(this.TAGS_LAYER)) {
        object.visible = shouldShowTags;
      }
    });
  }

  private getZoomLevel(): number {
    const frustumHeight = this.camera.top - this.camera.bottom;
    return 1000 / frustumHeight;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Handle canvas resize
    const canvas = this.renderer.domElement;
    const parent = canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width || canvas.height !== height) {
        this.renderer.setSize(width, height, false);

        // Update camera aspect ratio
        const aspect = width / height;
        const frustumHeight = this.camera.top - this.camera.bottom;
        this.camera.left = (-frustumHeight * aspect) / 2;
        this.camera.right = (frustumHeight * aspect) / 2;
        this.camera.updateProjectionMatrix();
      }
    }

    this.controls.update();
    this.updateTagVisibility();

    // Update zoom signal to match actual camera state
    const currentZoom = this.getZoomLevel();
    if (this.zoom() !== currentZoom) {
      this.zoom.set(currentZoom);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private setupEventHandlers(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointermove', this.onPointerMove);
  }

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    let hoveredTag: TagObject | null = null;
    for (const intersect of intersects) {
      const parent = this.findTagParent(intersect.object);
      if (parent instanceof TagObject) {
        hoveredTag = parent;
        break;
      }
    }

    if (this.currentHoveredTag !== hoveredTag) {
      if (this.currentHoveredTag) {
        this.currentHoveredTag.setHovered(false);
      }
      if (hoveredTag) {
        hoveredTag.setHovered(true);
      }
      this.currentHoveredTag = hoveredTag;
      this.hoveredTagId.set(hoveredTag?.tagId ?? null);
    }
  };

  private findTagParent(object: THREE.Object3D): TagObject | null {
    let current: THREE.Object3D | null = object;
    while (current) {
      if (current instanceof TagObject) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }
}
