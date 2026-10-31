import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-post-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card flex animate-pulse flex-col gap-3 p-5 md:p-6" aria-hidden="true">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="size-6 rounded-full bg-surface-3"></div>
          <div class="h-4 w-24 rounded-sm bg-surface-3"></div>
        </div>
        <div class="h-4 w-16 rounded-full bg-surface-3"></div>
      </div>
      <div class="h-6 w-3/4 rounded-sm bg-surface-3"></div>
      <div class="h-4 w-full rounded-sm bg-surface-2"></div>
      <div class="h-4 w-2/3 rounded-sm bg-surface-2"></div>
    </div>
  `,
})
export class PostSkeletonComponent {}
