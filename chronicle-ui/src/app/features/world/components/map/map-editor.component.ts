import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild
} from '@angular/core';
import { MapAction, MapActionType } from '../../types/map-action.types';
import { MapActionService } from '../../services/map/map-action.service';
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
  private readonly actionService = inject(MapActionService);

  ngOnInit(): void {
    this.renderer.initialize(this.mapCanvas().nativeElement);
  }

  ngOnDestroy(): void {
    this.renderer.destroy();
  }

  onCanvasClick(event: MouseEvent): void {
    if (this.readonly()) return;
    const action = this.action();
    if (action.type === MapActionType.NONE) return;

    const coords = this.renderer.getCanvasCoordinates(event);
    if (!coords) return;

    this.actionService.dispatch(action, coords.x, coords.y);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.renderer.zoomIn();
    } else {
      this.renderer.zoomOut();
    }
  }
}
