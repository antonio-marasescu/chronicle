import { Component, effect, inject, OnInit } from '@angular/core';
import { MapEditorComponent } from '../../../../../../world/components/map/map-editor.component';
import { MapActionType } from '../../../../../../world/types/map-action.types';
import { MapFacadeService } from '../../../../../../world/services/map/map-facade.service';
import { MOCK_WORLD_MAPS } from '../../../../../../../core/testing/mocks/world-map.mocks';

@Component({
  selector: 'app-campaign-world-view',
  imports: [MapEditorComponent],
  templateUrl: './campaign-world-view.component.html'
})
export class CampaignWorldViewComponent implements OnInit {
  private readonly mapFacade = inject(MapFacadeService);
  protected readonly mapActionType = MapActionType;

  ngOnInit(): void {
    // Initialize with mock map if no maps loaded
    if (this.mapFacade.mapList().length === 0) {
      // Manually add the first mock map
      const mockMap = MOCK_WORLD_MAPS[0];
      (this.mapFacade as any).maps.set([mockMap]);
      this.mapFacade.selectMap(mockMap.id);
    } else if (!this.mapFacade.activeMap()) {
      // Select first map if none active
      const firstMap = this.mapFacade.mapList()[0];
      this.mapFacade.selectMap(firstMap.id);
    }
  }
}
