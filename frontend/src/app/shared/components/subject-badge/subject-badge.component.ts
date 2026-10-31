import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-subject-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="chip whitespace-nowrap">{{ title() }}</span>`,
})
export class SubjectBadgeComponent {
  readonly title = input.required<string>();
}
