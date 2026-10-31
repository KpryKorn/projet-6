import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@store/auth/auth.store';
import { errorMessage } from '@utils/errors';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-in relative overflow-hidden">
      <div class="dot-grid pointer-events-none absolute inset-0" aria-hidden="true"></div>
      <span
        class="pointer-events-none absolute top-1/2 left-1/2 hidden size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong md:block"
        aria-hidden="true"
      ></span>
      <div class="container-page relative flex justify-center py-12 md:py-20">
        <div class="card relative w-full max-w-sm p-8 shadow-md">
          <h1 class="text-2xl font-semibold text-fg">Content de te revoir</h1>
          <p class="mt-2 text-base text-muted">Retrouve ton fil et tes articles enregistrés.</p>

          @if (error(); as message) {
            <p
              role="alert"
              class="mt-6 flex items-start gap-2 rounded-md border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger"
            >
              <i class="ph-fill ph-warning-circle mt-0.5 text-base" aria-hidden="true"></i>
              {{ message }}
            </p>
          }

          <form
            class="mt-6 flex flex-col gap-4"
            [formGroup]="form"
            (ngSubmit)="submit()"
            novalidate
          >
            <div class="flex flex-col gap-1">
              <label for="email" class="text-sm font-medium text-fg">Adresse email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                class="field"
                placeholder="toi@exemple.fr"
                [attr.aria-invalid]="invalid('email')"
              />
              @if (invalid('email')) {
                <p class="text-sm text-danger">Entre une adresse email valide.</p>
              }
            </div>

            <div class="flex flex-col gap-1">
              <label for="password" class="text-sm font-medium text-fg">Mot de passe</label>
              <div class="relative">
                <input
                  id="password"
                  [type]="reveal() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  class="field pr-10"
                  [attr.aria-invalid]="invalid('password')"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-subtle transition-colors duration-(--dur-1) ease-out hover:text-fg"
                  [attr.aria-label]="
                    reveal() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  "
                  (click)="reveal.set(!reveal())"
                >
                  <i [class]="reveal() ? 'ph ph-eye-slash' : 'ph ph-eye'" aria-hidden="true"></i>
                </button>
              </div>
              @if (invalid('password')) {
                <p class="text-sm text-danger">Entre ton mot de passe.</p>
              }
            </div>

            <button type="submit" class="btn btn-primary btn-lg mt-2" [disabled]="busy()">
              @if (busy()) {
                <i class="ph ph-circle-notch animate-spin" aria-hidden="true"></i>
                Connexion en cours
              } @else {
                Se connecter
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?
            <a
              routerLink="/register"
              class="font-medium text-accent-text underline underline-offset-4"
              >Créer un compte</a
            >
          </p>
        </div>
      </div>
    </section>
  `,
})
export class LoginPage {
  readonly returnUrl = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly busy = signal(false);
  protected readonly reveal = signal(false);
  protected readonly error = signal<string | null>(null);
  private submitted = false;

  protected invalid(name: 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted);
  }

  protected async submit(): Promise<void> {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await this.signIn(this.form.getRawValue());
  }

  private async signIn(credentials: { email: string; password: string }): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.login(credentials);
      const target = this.returnUrl();
      await this.router.navigateByUrl(
        target?.startsWith('/') && !target.startsWith('//') ? target : '/feed',
      );
    } catch (err) {
      this.error.set(errorMessage(err, 'La connexion a échoué. Réessaie dans un instant.'));
    } finally {
      this.busy.set(false);
    }
  }
}
