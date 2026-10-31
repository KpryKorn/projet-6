import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ConfirmService } from '@services/confirm/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line bg-surface p-6 text-fg shadow-lg"
      (cancel)="$event.preventDefault(); confirm.answer(false)"
      (click)="onBackdropClick($event)"
      aria-labelledby="confirm-title"
    >
      @if (confirm.request(); as request) {
        <div class="flex flex-col gap-4">
          <h2 id="confirm-title" class="text-xl font-semibold">{{ request.title }}</h2>
          <p class="text-base text-muted">{{ request.message }}</p>
          <div class="flex justify-end gap-2">
            <button type="button" class="btn btn-secondary" (click)="confirm.answer(false)">
              Annuler
            </button>
            <button
              type="button"
              class="btn"
              [class]="request.danger ? 'btn-danger' : 'btn-primary'"
              (click)="confirm.answer(true)"
            >
              {{ request.confirmLabel }}
            </button>
          </div>
        </div>
      }
    </dialog>
  `,
})
export class ConfirmDialogComponent {
  protected readonly confirm = inject(ConfirmService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.confirm.request()) {
        if (!el.open) el.showModal();
      } else if (el.open) {
        el.close();
      }
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.confirm.answer(false);
  }
}
