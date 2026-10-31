import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span
    class="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono font-medium text-fg shadow-[inset_0_0_0_1px_var(--line)] select-none"
    [class]="sizeClass()"
    aria-hidden="true"
    >{{ initial() }}</span
  >`,
})
export class AvatarComponent {
  readonly username = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  protected readonly initial = computed(() => this.username().charAt(0).toUpperCase());

  protected readonly sizeClass = computed(
    () =>
      ({
        sm: 'size-6 text-xs',
        md: 'size-8 text-sm',
        lg: 'size-12 text-lg',
        xl: 'size-20 text-2xl',
      })[this.size()],
  );
}
