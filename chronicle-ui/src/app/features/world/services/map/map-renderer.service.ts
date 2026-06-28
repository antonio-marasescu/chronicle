import { Injectable, signal } from '@angular/core';
import { Tag } from '../../types/map.types';

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;

@Injectable()
export class MapRendererService {
  readonly initialized = signal(false);
  readonly tags = signal<Tag[]>([]);
  readonly zoom = signal(MIN_ZOOM);

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private currentImage: HTMLImageElement | null = null;
  private offsetX = 0;
  private offsetY = 0;

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.initialized.set(true);
  }

  loadImage(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.currentImage = img;
      this.zoom.set(MIN_ZOOM);
      this.offsetX = 0;
      this.offsetY = 0;
      this.render();
    };
    img.src = url;
  }

  addTag(tag: Tag): void {
    this.tags.update(tags => [...tags, tag]);
    this.render();
  }

  zoomIn(): void {
    const next = Math.min(this.zoom() + ZOOM_STEP, MAX_ZOOM);
    this.zoom.set(next);
    this.clampOffset();
    this.render();
  }

  zoomOut(): void {
    const next = Math.max(this.zoom() - ZOOM_STEP, MIN_ZOOM);
    this.zoom.set(next);
    this.clampOffset();
    this.render();
  }

  getCanvasCoordinates(event: MouseEvent): { x: number; y: number } | null {
    if (!this.canvas || !this.currentImage) return null;
    const rect = this.canvas.getBoundingClientRect();
    const z = this.zoom();
    const pixelX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
    const pixelY = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    return {
      x: pixelX / z + this.offsetX,
      y: pixelY / z + this.offsetY
    };
  }

  clear(): void {
    this.currentImage = null;
    this.tags.set([]);
    this.zoom.set(MIN_ZOOM);
    this.offsetX = 0;
    this.offsetY = 0;
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  destroy(): void {
    this.clear();
    this.canvas = null;
    this.ctx = null;
    this.initialized.set(false);
  }

  private clampOffset(): void {
    if (!this.currentImage) return;
    const z = this.zoom();
    const maxOffsetX = this.currentImage.naturalWidth - this.currentImage.naturalWidth / z;
    const maxOffsetY = this.currentImage.naturalHeight - this.currentImage.naturalHeight / z;
    this.offsetX = Math.max(0, Math.min(this.offsetX, maxOffsetX));
    this.offsetY = Math.max(0, Math.min(this.offsetY, maxOffsetY));
  }

  private render(): void {
    if (!this.canvas || !this.ctx || !this.currentImage) return;
    const imgW = this.currentImage.naturalWidth;
    const imgH = this.currentImage.naturalHeight;
    this.canvas.width = imgW;
    this.canvas.height = imgH;

    const z = this.zoom();
    const viewW = imgW / z;
    const viewH = imgH / z;

    this.ctx.clearRect(0, 0, imgW, imgH);
    this.ctx.drawImage(
      this.currentImage,
      this.offsetX,
      this.offsetY,
      viewW,
      viewH,
      0,
      0,
      imgW,
      imgH
    );
    this.renderTags(z);
  }

  private renderTags(z: number): void {
    if (!this.ctx) return;
    for (const tag of this.tags()) {
      const screenX = (tag.x - this.offsetX) * z;
      const screenY = (tag.y - this.offsetY) * z;
      this.ctx.beginPath();
      this.ctx.arc(screenX, screenY, tag.size * z, 0, Math.PI * 2);
      this.ctx.fillStyle = tag.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
}
