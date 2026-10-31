import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { ConfirmService } from '@services/confirm/confirm.service';
import { ThemeService } from '@services/theme/theme.service';
import { ToastService } from '@services/toast/toast.service';
import { AuthStore } from '@store/auth/auth.store';
import { UserStore } from '@store/user/user.store';
import { errorMessage, fieldErrors } from '@utils/errors';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AvatarComponent],
  template: `
    <section class="page-in container-page max-w-3xl py-8 md:py-12">
      @if (user.me(); as me) {
        <header class="flex items-center gap-4">
          <app-avatar [username]="me.username" size="lg" />
          <div class="flex-1">
            <h1 class="text-3xl font-semibold text-fg">Mon profil</h1>
            <p class="text-base text-muted">{{ me.email }}</p>
          </div>
          <a [routerLink]="['/u', me.id]" class="btn btn-secondary btn-sm"
            >Voir mon profil public</a
          >
        </header>

        <form
          class="card mt-8 flex flex-col gap-4 p-6"
          [formGroup]="infoForm"
          (ngSubmit)="saveInfo()"
          novalidate
        >
          <h2 class="text-xl font-semibold text-fg">Informations publiques</h2>

          <div class="flex flex-col gap-1">
            <label for="username" class="text-sm font-medium text-fg">Pseudo</label>
            <input id="username" formControlName="username" class="field" autocomplete="username" />
            @if (
              infoErrors()['username'] ||
              (infoForm.controls.username.invalid && infoForm.controls.username.touched)
            ) {
              <p class="text-sm text-danger">
                {{
                  infoErrors()['username'] || 'Le pseudo doit contenir entre 3 et 30 caractères.'
                }}
              </p>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="bio" class="text-sm font-medium text-fg">Présentation</label>
            <textarea
              id="bio"
              formControlName="bio"
              rows="3"
              class="field resize-y"
              placeholder="Deux ou trois phrases sur ton parcours et tes thèmes favoris."
            ></textarea>
            <p class="text-right text-sm text-subtle tabular-nums">
              {{ infoForm.controls.bio.value.length }} / 280
            </p>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="savingInfo() || infoForm.pristine"
            >
              @if (savingInfo()) {
                <i class="ph ph-circle-notch animate-spin" aria-hidden="true"></i>
              }
              Enregistrer
            </button>
          </div>
        </form>

        <form
          class="card mt-6 flex flex-col gap-4 p-6"
          [formGroup]="passwordForm"
          (ngSubmit)="savePassword()"
          novalidate
        >
          <h2 class="text-xl font-semibold text-fg">Mot de passe</h2>
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-medium text-fg">Nouveau mot de passe</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="field"
              autocomplete="new-password"
            />
            <p class="text-sm" [class]="passwordError() ? 'text-danger' : 'text-subtle'">
              {{
                passwordError() ??
                  '8 caractères au minimum, avec une minuscule, une majuscule, un chiffre et un caractère spécial.'
              }}
            </p>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="savingPassword() || passwordForm.pristine"
            >
              @if (savingPassword()) {
                <i class="ph ph-circle-notch animate-spin" aria-hidden="true"></i>
              }
              Changer le mot de passe
            </button>
          </div>
        </form>

        <div class="card mt-6 p-6">
          <h2 class="text-xl font-semibold text-fg">Thèmes suivis</h2>
          @if (user.subscriptions().length > 0) {
            <ul class="mt-4 flex flex-col divide-y divide-line">
              @for (subject of user.subscriptions(); track subject.id) {
                <li class="flex items-center justify-between gap-4 py-3">
                  <a
                    [routerLink]="['/subjects', subject.id]"
                    class="text-base font-medium text-fg hover:text-accent-text"
                    >{{ subject.title }}</a
                  >
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm"
                    (click)="user.toggleFollow(subject)"
                  >
                    Ne plus suivre
                  </button>
                </li>
              }
            </ul>
          } @else {
            <p class="mt-2 text-base text-muted">
              Tu ne suis aucun thème pour l’instant.
              <a
                routerLink="/subjects"
                class="font-semibold text-accent-text underline underline-offset-4"
                >Explorer les thèmes</a
              >
            </p>
          }
        </div>

        <div class="card mt-6 p-6">
          <h2 class="text-xl font-semibold text-fg">Apparence</h2>
          <div class="mt-4 flex gap-2" role="group" aria-label="Mode d’affichage">
            <button
              type="button"
              class="btn"
              [class]="theme.theme() === 'dark' ? 'btn-primary' : 'btn-secondary'"
              [attr.aria-pressed]="theme.theme() === 'dark'"
              (click)="theme.set('dark')"
            >
              <i class="ph ph-moon" aria-hidden="true"></i>
              Sombre
            </button>
            <button
              type="button"
              class="btn"
              [class]="theme.theme() === 'light' ? 'btn-primary' : 'btn-secondary'"
              [attr.aria-pressed]="theme.theme() === 'light'"
              (click)="theme.set('light')"
            >
              <i class="ph ph-sun" aria-hidden="true"></i>
              Clair
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button type="button" class="btn btn-danger" (click)="logout()">
            <i class="ph ph-sign-out" aria-hidden="true"></i>
            Se déconnecter
          </button>
        </div>
      } @else {
        <div class="flex animate-pulse flex-col gap-4" aria-busy="true">
          <div class="h-12 w-64 rounded-lg bg-surface-3"></div>
          <div class="h-48 rounded-lg bg-surface-2"></div>
        </div>
      }
    </section>
  `,
})
export class ProfilePage {
  protected readonly user = inject(UserStore);
  protected readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly fb = inject(FormBuilder);

  protected readonly infoForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    bio: ['', Validators.maxLength(280)],
  });
  protected readonly passwordForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
  });

  protected readonly savingInfo = signal(false);
  protected readonly savingPassword = signal(false);
  protected readonly infoErrors = signal<Record<string, string>>({});
  protected readonly passwordError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const me = this.user.me();
      if (me) {
        untracked(() => {
          if (this.infoForm.pristine) {
            this.infoForm.reset({ username: me.username, bio: me.bio ?? '' });
          }
        });
      }
    });
  }

  protected async saveInfo(): Promise<void> {
    this.infoForm.markAllAsTouched();
    if (this.infoForm.invalid) return;
    this.savingInfo.set(true);
    this.infoErrors.set({});
    try {
      const { username, bio } = this.infoForm.getRawValue();
      await this.user.update({ username, bio });
      this.infoForm.markAsPristine();
      this.toast.success('Profil mis à jour.');
    } catch (err) {
      this.infoErrors.set(fieldErrors(err));
      this.toast.error(errorMessage(err, 'La mise à jour a échoué. Réessaie dans un instant.'));
    } finally {
      this.savingInfo.set(false);
    }
  }

  protected async savePassword(): Promise<void> {
    this.passwordForm.markAllAsTouched();
    this.passwordError.set(null);
    if (this.passwordForm.invalid) {
      this.passwordError.set('Le mot de passe ne respecte pas les critères indiqués.');
      return;
    }
    this.savingPassword.set(true);
    try {
      await this.user.update({ password: this.passwordForm.getRawValue().password });
      this.passwordForm.reset({ password: '' });
      this.toast.success('Mot de passe modifié.');
    } catch (err) {
      this.passwordError.set(
        errorMessage(err, 'Le changement a échoué. Réessaie dans un instant.'),
      );
    } finally {
      this.savingPassword.set(false);
    }
  }

  protected async logout(): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: 'Se déconnecter ?',
      message: 'Tu pourras te reconnecter à tout moment avec ton email et ton mot de passe.',
      confirmLabel: 'Se déconnecter',
    });
    if (confirmed) {
      this.user.clear();
      await this.auth.logout();
    }
  }
}
