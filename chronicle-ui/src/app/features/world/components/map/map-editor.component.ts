import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild
} from '@angular/core';
import { MapRendererService } from '../../services/map/map-renderer.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MapRendererService]
})
export class MapEditorComponent implements OnInit, OnDestroy {
  private readonly mapCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('mapCanvas');
  private readonly renderer = inject(MapRendererService);

  ngOnInit(): void {
    this.renderer.initialize(this.mapCanvas().nativeElement);
  }

  ngOnDestroy(): void {
    this.renderer.destroy();
  }
}
