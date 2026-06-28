import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild
} from '@angular/core';
import { MapRendererService } from '../../services/map/map-renderer.service';
import { MapClickEvent, MapEditorMode } from '../../types/world.types';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MapRendererService]
})
export class MapEditorComponent implements OnInit, OnDestroy {
  private readonly mapCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('mapCanvas');
  private readonly renderer = inject(MapRendererService);

  readonly mode = input<MapEditorMode>('edit');
  readonly mapClick = output<MapClickEvent>();

  constructor() {
    effect(() => {
      this.renderer.setMode(this.mode());
    });

    effect(() => {
      const event = this.renderer.lastClickEvent();
      if (event !== null) {
        this.mapClick.emit(event);
      }
    });
  }

  ngOnInit(): void {
    this.renderer.initialize(this.mapCanvas().nativeElement);
  }

  ngOnDestroy(): void {
    this.renderer.destroy();
  }
}
