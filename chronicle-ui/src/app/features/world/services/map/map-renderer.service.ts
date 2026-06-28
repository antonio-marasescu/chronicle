import { Injectable, signal } from '@angular/core';
import { MapClickEvent, MapEditorMode, Tag } from '../../types/world.types';

@Injectable()
export class MapRendererService {
  readonly initialized = signal(false);
  readonly tags = signal<Tag[]>([]);
  readonly lastClickEvent = signal<MapClickEvent | null>(null);

  private mode: MapEditorMode = 'edit';
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private currentImage: HTMLImageElement | null = null;
  private readonly onClick = this.handleClick.bind(this);

  setMode(mode: MapEditorMode): void {
    this.mode = mode;
  }

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.addEventListener('click', this.onClick);
    this.initialized.set(true);
  }

  loadImage(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.currentImage = img;
      this.render();
    };
    img.src = url;
  }

  clear(): void {
    this.currentImage = null;
    this.tags.set([]);
    this.lastClickEvent.set(null);
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  destroy(): void {
    this.canvas?.removeEventListener('click', this.onClick);
    this.clear();
    this.canvas = null;
    this.ctx = null;
    this.initialized.set(false);
  }

  private handleClick(event: MouseEvent): void {
    if (!this.canvas || !this.currentImage) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (this.mode === 'edit') {
      const tag: Tag = {
        id: crypto.randomUUID(),
        label: '',
        color: '#ef4444',
        x,
        y
      };
      this.tags.update(tags => [...tags, tag]);
      this.render();
    } else {
      this.lastClickEvent.set({ x, y });
    }
  }

  private render(): void {
    if (!this.canvas || !this.ctx || !this.currentImage) return;
    this.canvas.width = this.currentImage.naturalWidth;
    this.canvas.height = this.currentImage.naturalHeight;
    this.ctx.drawImage(this.currentImage, 0, 0);
    this.renderTags();
  }

  private renderTags(): void {
    if (!this.ctx) return;
    const radius = 8;
    for (const tag of this.tags()) {
      this.ctx.beginPath();
      this.ctx.arc(tag.x, tag.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = tag.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
}
