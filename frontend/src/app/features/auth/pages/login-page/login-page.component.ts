import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthStore } from '@store/auth/auth.store';
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
  host: {
    class: 'contents',
  },
})
export class LoginPageComponent {
  protected readonly authStore = inject(AuthStore);

  isLoading = this.authStore.isLoading;
  error = this.authStore.error;

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
      this.authStore.login(request);
      this.loginForm.reset();
    }
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && control.touched;
  }
}
