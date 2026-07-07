import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { World } from '../../../../core/types/dtos/view/world-view.types';

@Injectable()
export class MapGraphicsService {
  private readonly textureLoader = new THREE.TextureLoader();
  private textureCache = new Map<string, THREE.Texture>();

  createMap(world: World, width?: number): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      const cachedTexture = this.textureCache.get(world.imageUrl);
      if (cachedTexture) {
        const mesh = this.createMapMeshFromTexture(cachedTexture, width);
        mesh.userData = { worldId: world.id };
        resolve(mesh);
        return;
      }

      // Load texture
      this.textureLoader.load(
        world.imageUrl,
        texture => {
          this.textureCache.set(world.imageUrl, texture);
          const mesh = this.createMapMeshFromTexture(texture, width);
          mesh.userData = { worldId: world.id };
          resolve(mesh);
        },
        undefined,
        error => {
          console.error('Error loading map texture:', error);
          reject(error);
        }
      );
    });
  }

  private createMapMeshFromTexture(texture: THREE.Texture, width?: number): THREE.Mesh {
    const image = texture.image as HTMLImageElement;
    const aspect = image.width / image.height;
    const meshWidth = width ?? 1000;
    const meshHeight = meshWidth / aspect;

    const geometry = new THREE.PlaneGeometry(meshWidth, meshHeight);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'map';

    return mesh;
  }

  clearCache(): void {
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
  }

  disposeCachedTexture(imageUrl: string): void {
    const texture = this.textureCache.get(imageUrl);
    if (texture) {
      texture.dispose();
      this.textureCache.delete(imageUrl);
    }
  }
}
