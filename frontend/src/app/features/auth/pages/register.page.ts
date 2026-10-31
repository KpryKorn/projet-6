import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@store/auth/auth.store';
import { errorMessage, fieldErrors } from '@utils/errors';

const PASSWORD_RULES = [
  { label: '8 caractères au minimum', test: (v: string) => v.length >= 8 },
  { label: 'Une minuscule', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Une majuscule', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Un chiffre', test: (v: string) => /\d/.test(v) },
  { label: 'Un caractère spécial (@ $ ! % * ? &)', test: (v: string) => /[@$!%*?&]/.test(v) },
];

@Component({
  selector: 'app-register-page',
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
          <h1 class="text-2xl font-semibold text-fg">Crée ton compte</h1>
          <p class="mt-2 text-base text-muted">
            Une minute suffit pour suivre tes premiers thèmes et publier ton premier article.
          </p>

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
              <label for="username" class="text-sm font-medium text-fg">Pseudo</label>
              <input
                id="username"
                formControlName="username"
                autocomplete="username"
                class="field"
                placeholder="ada_lovelace"
                [attr.aria-invalid]="invalid('username')"
              />
              @if (invalid('username')) {
                <p class="text-sm text-danger">
                  {{ message('username', 'Le pseudo doit contenir entre 3 et 30 caractères.') }}
                </p>
              }
            </div>

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
                <p class="text-sm text-danger">
                  {{ message('email', 'Entre une adresse email valide.') }}
                </p>
              }
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-medium text-fg">Mot de passe</label>
              <div class="relative">
                <input
                  id="password"
                  [type]="reveal() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="new-password"
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
              <ul class="flex flex-col gap-1 text-sm" aria-label="Critères du mot de passe">
                @for (rule of rules; track rule.label) {
                  <li
                    class="flex items-center gap-2 transition-colors duration-(--dur-1) ease-out"
                    [class]="rule.test(password()) ? 'text-success' : 'text-subtle'"
                  >
                    <i
                      [class]="rule.test(password()) ? 'ph-fill ph-check-circle' : 'ph ph-circle'"
                      aria-hidden="true"
                    ></i>
                    {{ rule.label }}
                  </li>
                }
              </ul>
            </div>

            <button type="submit" class="btn btn-primary btn-lg mt-2" [disabled]="busy()">
              @if (busy()) {
                <i class="ph ph-circle-notch animate-spin" aria-hidden="true"></i>
                Création en cours
              } @else {
                Créer mon compte
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-muted">
            As-tu déjà un compte ?
            <a routerLink="/login" class="font-medium text-accent-text underline underline-offset-4"
              >Se connecter</a
            >
          </p>
        </div>
      </div>
    </section>
  `,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly rules = PASSWORD_RULES;
  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        (control: AbstractControl) =>
          PASSWORD_RULES.every((rule) => rule.test(control.value ?? '')) ? null : { weak: true },
      ],
    ],
  });
  protected readonly password = toSignal(this.form.controls.password.valueChanges, {
    initialValue: '',
  });
  protected readonly busy = signal(false);
  protected readonly reveal = signal(false);
  protected readonly error = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string>>({});
  private submitted = false;

  protected invalid(name: 'username' | 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return (control.invalid && (control.touched || this.submitted)) || !!this.serverErrors()[name];
  }

  protected message(name: string, fallback: string): string {
    return this.serverErrors()[name] ?? fallback;
  }

  protected async submit(): Promise<void> {
    this.submitted = true;
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.register(this.form.getRawValue());
      await this.router.navigateByUrl('/onboarding');
    } catch (err) {
      this.serverErrors.set(fieldErrors(err));
      this.error.set(
        errorMessage(err, 'La création du compte a échoué. Réessaie dans un instant.'),
      );
    } finally {
      this.busy.set(false);
    }
  }
}
