import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-12 text-center"
    >
      <span class="icon-tile size-12 text-2xl">
        <i [class]="icon()" aria-hidden="true"></i>
      </span>
      <h2 class="text-lg font-semibold text-fg">{{ title() }}</h2>
      <p class="max-w-md text-base text-muted">{{ description() }}</p>
      <div class="mt-2 flex flex-wrap items-center justify-center gap-2">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input('ph ph-magnifying-glass');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
