import { Component, inject } from '@angular/core';
import { TailwindWrapperComponent } from '@components/tailwind-wrapper/tailwind-wrapper.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Store } from '@ngrx/store';
import { AuthActions } from '@store/auth/auth.actions';
import { selectError, selectIsLoading } from '@store/auth/auth.selectors';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent extends TailwindWrapperComponent {
  private readonly store = inject(Store);

  isLoading = this.store.selectSignal(selectIsLoading);
  error = this.store.selectSignal(selectError);

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const request = this.loginForm.getRawValue();
      this.store.dispatch(AuthActions.login({ request }));
      this.loginForm.reset();
    }
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && control.touched;
  }
}
