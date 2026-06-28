import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { MapAction, MapActionType } from '../../types/map-action.types';
import { Point } from '../../types/map-render.types';
import { MapActionService } from '../../services/map/map-action.service';
import { MapFacadeService } from '../../services/map/map-facade.service';
import { MapRendererService } from '../../services/map/map-renderer.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MapActionService, MapRendererService]
})
export class MapEditorComponent implements OnInit, OnDestroy {
  readonly readonly = input(false);
  readonly action = input<MapAction>({ type: MapActionType.NONE });

  private readonly mapCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('mapCanvas');
  private readonly renderer = inject(MapRendererService);
  private readonly facade = inject(MapFacadeService);
  private readonly actionService = inject(MapActionService);

  private readonly dragging = signal(false);
  private readonly lastMouse = signal<Point>({ x: 0, y: 0 });

  constructor() {
    effect(() => {
      const map = this.facade.activeMap();
      untracked(() => {
        if (map) {
          this.renderer.loadImage(map.imageUrl);
        } else {
          this.renderer.clear();
        }
      });
    });
  }

  ngOnInit(): void {
    this.renderer.initialize(this.mapCanvas().nativeElement);
  }

  ngOnDestroy(): void {
    this.renderer.destroy();
  }

  onCanvasClick(event: MouseEvent): void {
    if (this.readonly()) return;
    const action = this.action();
    if (action.type === MapActionType.NONE || action.type === MapActionType.PAN) return;

    const coords = this.renderer.getCanvasCoordinates(event);
    if (!coords) return;

    this.actionService.dispatch(action, coords.x, coords.y);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const canvas = this.mapCanvas().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const cursorX = (event.clientX - rect.left) * (canvas.width / rect.width);
    const cursorY = (event.clientY - rect.top) * (canvas.height / rect.height);
    const direction = event.deltaY < 0 ? 1 : -1;
    this.renderer.zoomAt(direction, cursorX, cursorY);
  }

  onMouseDown(event: MouseEvent): void {
    if (this.action().type !== MapActionType.PAN) return;
    this.dragging.set(true);
    this.lastMouse.set({ x: event.clientX, y: event.clientY });
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.dragging()) return;
    const last = this.lastMouse();
    const deltaX = event.clientX - last.x;
    const deltaY = event.clientY - last.y;
    this.lastMouse.set({ x: event.clientX, y: event.clientY });
    this.renderer.pan(deltaX, deltaY);
  }

  onMouseUp(): void {
    this.dragging.set(false);
  }
}
