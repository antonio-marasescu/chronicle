import { Routes } from '@angular/router';

export const WORLD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/world/world-editor.component').then(m => m.WorldEditorComponent)
  }
];
