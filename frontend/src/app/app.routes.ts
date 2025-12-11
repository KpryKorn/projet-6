import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../app/pages/login-page/login-page.component').then((c) => c.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/pages/register-page/register-page.component').then(
        (c) => c.RegisterPageComponent
      ),
  },
];
