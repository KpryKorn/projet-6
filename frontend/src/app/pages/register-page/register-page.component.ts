import { Component, inject } from '@angular/core';
import { TailwindWrapperComponent } from '../../components/tailwind-wrapper/tailwind-wrapper.component';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../../core/state/auth/auth.selectors';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthActions } from '../../core/state/auth/auth.actions';
import { PasswordModule } from 'primeng/password';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

const passwordMismatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent extends TailwindWrapperComponent {
  private readonly store = inject(Store);

  isLoading = this.store.selectSignal(selectIsLoading);
  error = this.store.selectSignal(selectError);

  registerForm = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMismatchValidator }
  );

  onSubmit() {
    if (this.registerForm.valid) {
      const request = {
        email: this.registerForm.getRawValue().email,
        username: this.registerForm.getRawValue().username,
        password: this.registerForm.getRawValue().confirmPassword,
      };
      this.store.dispatch(AuthActions.register({ request }));
      this.registerForm.reset();
    }
  }

  isInvalid(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && control.touched;
  }
}
