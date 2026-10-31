import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';
import { ToastHostComponent } from '@components/toast-host/toast-host.component';
import { AuthStore } from '@store/auth/auth.store';
import { UserStore } from '@store/user/user.store';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastHostComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <a
      href="#main"
      class="sr-only z-50 rounded-md bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >Aller au contenu</a
    >
    <app-header />
    <main id="main" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast-host />
    <app-confirm-dialog />
  `,
})
export class App {
  private readonly auth = inject(AuthStore);
  private readonly user = inject(UserStore);

  constructor() {
    effect(() => {
      const authenticated = this.auth.isAuthenticated();
      untracked(() => (authenticated ? void this.user.load() : this.user.clear()));
    });
  }
}
