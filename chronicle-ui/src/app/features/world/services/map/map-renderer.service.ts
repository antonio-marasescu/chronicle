import { Injectable, signal } from '@angular/core';
import { Tag } from '../../types/map.types';
import { DrawMetrics } from '../../types/map-render.types';
import {
  clampOffset,
  computeDrawMetrics,
  screenToWorld,
  worldToScreen
} from '../../utils/map/map.utils';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../../world.constants';

@Injectable()
export class MapRendererService {
  readonly initialized = signal(false);
  readonly tags = signal<Tag[]>([]);
  readonly zoom = signal(MIN_ZOOM);

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private currentImage: HTMLImageElement | null = null;
  // Top-left corner of the visible viewport in world (image) coordinates
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

  zoomAt(direction: 1 | -1, cursorX: number, cursorY: number): void {
    if (!this.canvas || !this.currentImage) return;

    const oldZoom = this.zoom();
    const newZoom = Math.max(MIN_ZOOM, Math.min(oldZoom + ZOOM_STEP * direction, MAX_ZOOM));
    if (newZoom === oldZoom) return;

    const metrics = this.getDrawMetrics();
    const world = screenToWorld(cursorX, cursorY, metrics, oldZoom, this.offsetX, this.offsetY);

    this.zoom.set(newZoom);

    this.offsetX = world.x - (cursorX - metrics.drawOffsetX) / (metrics.scale * newZoom);
    this.offsetY = world.y - (cursorY - metrics.drawOffsetY) / (metrics.scale * newZoom);

    this.applyClampOffset();
    this.render();
  }

  pan(deltaX: number, deltaY: number): void {
    if (!this.currentImage || !this.canvas) return;
    const z = this.zoom();
    if (z <= MIN_ZOOM) return;
    const metrics = this.getDrawMetrics();
    this.offsetX -= deltaX / (metrics.scale * z);
    this.offsetY -= deltaY / (metrics.scale * z);
    this.applyClampOffset();
    this.render();
  }

  getCanvasCoordinates(event: MouseEvent): { x: number; y: number } | null {
    if (!this.canvas || !this.currentImage) return null;
    const rect = this.canvas.getBoundingClientRect();
    const pixelX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
    const pixelY = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    const metrics = this.getDrawMetrics();
    return screenToWorld(pixelX, pixelY, metrics, this.zoom(), this.offsetX, this.offsetY);
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

  private applyClampOffset(): void {
    if (!this.currentImage) return;
    const clamped = clampOffset(
      this.offsetX,
      this.offsetY,
      this.currentImage.naturalWidth,
      this.currentImage.naturalHeight,
      this.zoom()
    );
    this.offsetX = clamped.offsetX;
    this.offsetY = clamped.offsetY;
  }

  private getDrawMetrics() {
    if (!this.canvas || !this.currentImage) {
      return { drawOffsetX: 0, drawOffsetY: 0, scale: 1 };
    }
    return computeDrawMetrics(
      this.canvas.width,
      this.canvas.height,
      this.currentImage.naturalWidth,
      this.currentImage.naturalHeight
    );
  }

  private render(): void {
    if (!this.canvas || !this.ctx || !this.currentImage) return;

    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    const metrics = this.getDrawMetrics();
    const z = this.zoom();
    const imgW = this.currentImage.naturalWidth;
    const imgH = this.currentImage.naturalHeight;
    const viewW = imgW / z;
    const viewH = imgH / z;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.currentImage,
      this.offsetX,
      this.offsetY,
      viewW,
      viewH,
      metrics.drawOffsetX,
      metrics.drawOffsetY,
      imgW * metrics.scale,
      imgH * metrics.scale
    );
    this.renderTags(z, metrics);
  }

  private renderTags(z: number, metrics: DrawMetrics): void {
    if (!this.ctx) return;
    for (const tag of this.tags()) {
      const screen = worldToScreen(tag.x, tag.y, metrics, z, this.offsetX, this.offsetY);
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, tag.size * metrics.scale, 0, Math.PI * 2);
      this.ctx.fillStyle = tag.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
}
