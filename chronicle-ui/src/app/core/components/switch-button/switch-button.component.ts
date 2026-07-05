import { Component, input, output } from '@angular/core';
import { SwitchButtonOption } from '../../types/components/switch-button.types';

@Component({
  selector: 'app-switch-button',
  imports: [],
  templateUrl: './switch-button.component.html'
})
export class SwitchButtonComponent {
  checked = input.required<boolean>();
  offOption = input.required<SwitchButtonOption>();
  onOption = input.required<SwitchButtonOption>();
  size = input<'sm' | 'md' | 'lg'>('lg');
  checkedChange = output<boolean>();

  protected onToggle(): void {
    this.checkedChange.emit(!this.checked());
  }
}
