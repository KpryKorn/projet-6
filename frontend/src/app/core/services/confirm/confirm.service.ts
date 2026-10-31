import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly request = signal<ConfirmRequest | null>(null);
  private resolver: ((value: boolean) => void) | null = null;

  ask(request: ConfirmRequest): Promise<boolean> {
    this.resolver?.(false);
    this.request.set(request);
    return new Promise((resolve) => (this.resolver = resolve));
  }

  answer(value: boolean): void {
    this.request.set(null);
    this.resolver?.(value);
    this.resolver = null;
  }
}
