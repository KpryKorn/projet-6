import { Component, effect, inject, OnInit } from '@angular/core';
import { TailwindWrapperComponent } from '@components/tailwind-wrapper/tailwind-wrapper.component';
import { HeaderComponent } from '@components/header/header.component';
import { UserStateService } from '@services/stateful/user/user-state.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-profile-page',
  imports: [HeaderComponent, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule],
  templateUrl: './my-profile-page.component.html',
})
export class MyProfilePageComponent extends TailwindWrapperComponent implements OnInit {
  private readonly userStateService = inject(UserStateService);

  public readonly user = this.userStateService.currentUser;

  editProfileForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(3), Validators.maxLength(100)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(6)],
    }),
  });

  constructor() {
    super();
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.editProfileForm.patchValue({
          username: currentUser.username,
          email: currentUser.email,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const { username, email, password } = this.editProfileForm.value;
      this.userStateService
        .updateMe({
          username: username || undefined,
          email: email || undefined,
          password: password || undefined,
        })
        .subscribe();
      this.editProfileForm.get('password')?.reset();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.editProfileForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  ngOnInit(): void {
    this.userStateService.fetchMe().subscribe();
  }
}
