import { Routes } from '@angular/router';

export const WORLD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/map/map-editor.component').then(m => m.MapEditorComponent)
  }
];
