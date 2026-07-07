import { Injectable, signal } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class MapRendererService {
  readonly initialized = signal(false);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private animationFrameId: number | null = null;

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

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf3f4f6);

    // Load a texture and display it on a plane
    this.loadTexture('/assets/images/campaigns/mock-map.jpg');

    this.initialized.set(true);

    // Start render loop
    this.animate();
  }

  private loadTexture(url: string): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      url,
      texture => {
        const aspect = texture.image.width / texture.image.height;
        const width = 1000;
        const height = width / aspect;

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.name = 'map';
        this.scene.add(plane);

        // Fit camera to map
        this.fitCameraToMap(width, height);
      },
      undefined,
      error => {
        console.error('Error loading texture:', error);
      }
    );
  }

  private fitCameraToMap(width: number, height: number): void {
    const canvas = this.renderer.domElement;
    const aspect = canvas.width / canvas.height;
    const frustumHeight = Math.max(height, width / aspect);

    this.camera.top = frustumHeight / 2;
    this.camera.bottom = -frustumHeight / 2;
    this.camera.left = (-frustumHeight * aspect) / 2;
    this.camera.right = (frustumHeight * aspect) / 2;
    this.camera.updateProjectionMatrix();
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

    this.renderer.render(this.scene, this.camera);
  };

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.scene.clear();
    this.renderer.dispose();
    this.initialized.set(false);
  }
}
