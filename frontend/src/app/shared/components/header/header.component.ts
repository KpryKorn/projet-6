import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { ThemeService } from '@services/theme/theme.service';
import { AuthStore } from '@store/auth/auth.store';
import { UserStore } from '@store/user/user.store';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, AvatarComponent],
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    <header
      class="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-[8px]"
    >
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <a
          [routerLink]="auth.isAuthenticated() ? '/feed' : '/'"
          class="flex items-center gap-2 text-lg font-semibold tracking-tight text-fg"
          aria-label="MDD, page d’accueil"
        >
          <img
            src="favicon.svg"
            alt=""
            class="size-8 rounded-md ring-1 ring-line-strong"
            width="32"
            height="32"
          />
          MDD
        </a>

        @if (auth.isAuthenticated()) {
          <nav class="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            <a
              routerLink="/feed"
              routerLinkActive="nav-active"
              class="btn btn-ghost btn-sm relative"
              >Fil</a
            >
            <a
              routerLink="/subjects"
              routerLinkActive="nav-active"
              class="btn btn-ghost btn-sm relative"
              >Thèmes</a
            >
          </nav>
        }

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-ghost btn-sm size-10 px-0"
            (click)="theme.toggle()"
            [attr.aria-label]="
              theme.theme() === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'
            "
          >
            <i
              class="text-lg"
              [class]="theme.theme() === 'dark' ? 'ph ph-sun' : 'ph ph-moon'"
              aria-hidden="true"
            ></i>
          </button>

          @if (auth.isAuthenticated()) {
            <a routerLink="/posts/new" class="btn btn-primary btn-sm hidden md:inline-flex">
              <i class="ph-bold ph-pencil-simple-line" aria-hidden="true"></i>
              Écrire
            </a>
            <a
              routerLink="/profile"
              class="hidden rounded-full md:inline-flex"
              aria-label="Mon profil"
            >
              <app-avatar [username]="user.me()?.username ?? '?'" />
            </a>
          } @else {
            <a routerLink="/login" class="btn btn-ghost btn-sm hidden md:inline-flex">Connexion</a>
            <a routerLink="/register" class="btn btn-primary btn-sm hidden md:inline-flex"
              >Créer un compte</a
            >
          }

          <button
            type="button"
            class="btn btn-ghost btn-sm size-10 px-0 md:hidden"
            [attr.aria-expanded]="open()"
            aria-controls="mobile-menu"
            aria-label="Ouvrir le menu"
            (click)="open.set(true)"
          >
            <i class="ph ph-list text-xl" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>

    @if (open()) {
      <div
        id="mobile-menu"
        class="page-in fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-bg px-4 py-4 md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div
          class="dot-grid pointer-events-none absolute inset-x-0 top-0 h-64"
          aria-hidden="true"
        ></div>
        <div class="relative flex items-center justify-between">
          <span class="flex items-center gap-2 text-lg font-semibold">
            <img src="favicon.svg" alt="" class="size-6" width="24" height="24" />
            MDD
          </span>
          <button
            type="button"
            class="btn btn-ghost size-10 px-0"
            aria-label="Fermer le menu"
            (click)="close()"
          >
            <i class="ph ph-x text-xl" aria-hidden="true"></i>
          </button>
        </div>

        <nav class="relative mt-10 flex flex-col gap-2" aria-label="Menu mobile">
          @if (auth.isAuthenticated()) {
            @for (link of memberLinks; track link.path; let i = $index) {
              <a
                [routerLink]="link.path"
                (click)="close()"
                class="menu-in flex items-center gap-3 rounded-md border-b border-line px-4 py-4 text-xl font-medium text-fg hover:bg-surface-2"
                [style.animation-delay]="i * 60 + 'ms'"
              >
                <i [class]="link.icon + ' text-accent-text'" aria-hidden="true"></i>
                {{ link.label }}
              </a>
            }
            <button
              type="button"
              (click)="logout()"
              class="menu-in mt-4 flex items-center gap-3 rounded-md px-4 py-4 text-left text-xl font-medium text-muted hover:bg-surface-2"
              [style.animation-delay]="'240ms'"
            >
              <i class="ph ph-sign-out" aria-hidden="true"></i>
              Se déconnecter
            </button>
          } @else {
            <a
              routerLink="/login"
              (click)="close()"
              class="menu-in rounded-md border-b border-line px-4 py-4 text-xl font-medium text-fg hover:bg-surface-2"
              >Connexion</a
            >
            <a
              routerLink="/register"
              (click)="close()"
              class="menu-in btn btn-primary btn-lg mt-4"
              [style.animation-delay]="'60ms'"
              >Créer un compte</a
            >
          }
        </nav>
      </div>
    }
  `,
})
export class HeaderComponent {
  protected readonly auth = inject(AuthStore);
  protected readonly user = inject(UserStore);
  protected readonly theme = inject(ThemeService);
  private readonly document = inject(DOCUMENT);

  protected readonly open = signal(false);

  protected readonly memberLinks = [
    { path: '/feed', label: 'Fil d’actualité', icon: 'ph ph-newspaper' },
    { path: '/subjects', label: 'Thèmes', icon: 'ph ph-hash' },
    { path: '/posts/new', label: 'Écrire un article', icon: 'ph ph-pencil-simple-line' },
    { path: '/profile', label: 'Mon profil', icon: 'ph ph-user-circle' },
  ];

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.open() ? 'hidden' : '';
    });
  }

  protected close(): void {
    this.open.set(false);
  }

  protected async logout(): Promise<void> {
    this.close();
    this.user.clear();
    await this.auth.logout();
  }
}
