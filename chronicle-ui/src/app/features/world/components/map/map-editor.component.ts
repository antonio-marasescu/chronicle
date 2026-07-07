import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
  untracked
} from '@angular/core';
import { MapRendererService } from '../../services/map/map-renderer.service';
import { MapStoreService } from '../../services/map/map-store.service';
import { MapGraphicsService } from '../../services/map/map-graphics.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  providers: [MapRendererService, MapGraphicsService]
})
export class MapEditorComponent implements OnInit, OnDestroy {
  private readonly mapCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('mapCanvas');
  private readonly renderer = inject(MapRendererService);
  private readonly mapStore = inject(MapStoreService);

  constructor() {
    effect(() => {
      const world = this.mapStore.activeWorld();
      const rendererInitialized = this.renderer.initialized();
      if (world && rendererInitialized) {
        untracked(() => {
          this.renderer.loadMap(world);
        });
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
