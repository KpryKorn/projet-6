import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '@services/toast/toast.service';

@Component({
  selector: 'app-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 md:items-end md:px-6"
      aria-live="polite"
      role="status"
    >
      @for (toast of toasts.toasts(); track toast.id) {
        <div
          class="toast-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-md border border-line bg-surface px-4 py-3 text-sm text-fg shadow-lg"
        >
          <i
            class="mt-0.5 text-lg"
            [class]="
              toast.kind === 'success'
                ? 'ph-fill ph-check-circle text-success'
                : toast.kind === 'error'
                  ? 'ph-fill ph-warning-circle text-danger'
                  : 'ph-fill ph-info text-accent-text'
            "
            aria-hidden="true"
          ></i>
          <p class="flex-1">{{ toast.message }}</p>
          <button
            type="button"
            class="text-subtle transition-colors duration-(--dur-1) ease-out hover:text-fg"
            aria-label="Fermer la notification"
            (click)="toasts.dismiss(toast.id)"
          >
            <i class="ph ph-x" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastHostComponent {
  protected readonly toasts = inject(ToastService);
}
