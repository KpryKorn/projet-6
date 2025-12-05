import { Component, inject } from '@angular/core';
import { TailwindWrapperComponent } from '../../components/tailwind-wrapper/tailwind-wrapper.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent extends TailwindWrapperComponent {
  private readonly authService = inject(AuthService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // sauvegarder le token dans localstorage
        },
      }),
        this.loginForm.reset();
    }
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && control.touched;
  }
}
