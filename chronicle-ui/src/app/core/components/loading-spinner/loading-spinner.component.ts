import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  /**
   * Size of the loading spinner
   * @default 'lg'
   */
  size = input<'xs' | 'sm' | 'md' | 'lg'>('lg');

  /**
   * Whether to center the spinner in its container
   * @default true
   */
  centered = input<boolean>(true);

  /**
   * Optional message to display below the spinner
   */
  message = input<string>();
}
