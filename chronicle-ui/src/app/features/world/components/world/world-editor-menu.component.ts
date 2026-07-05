import { Component, input, output } from '@angular/core';
import { WorldEditorMenuAction, WorldEditorMenuItem } from '../../types/world-editor-menu.types';

@Component({
  selector: 'app-world-editor-menu',
  templateUrl: './world-editor-menu.component.html'
})
export class WorldEditorMenuComponent {
  readonly menuItems = input.required<WorldEditorMenuItem[]>();
  readonly selectedAction = input<WorldEditorMenuAction | null>(null);

  readonly actionSelect = output<WorldEditorMenuAction>();
  readonly fileSelect = output<File>();

  protected readonly WorldEditorMenuAction = WorldEditorMenuAction;

  onActionButtonClick(action: WorldEditorMenuAction): void {
    this.actionSelect.emit(action);
  }

  onFileSelected(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (file) {
      this.fileSelect.emit(file);
      input.value = '';
    }
  }
}
