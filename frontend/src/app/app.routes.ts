import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/pages/home-page/home-page.component').then((c) => c.HomePageComponent),
  },
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
  {
    path: 'feed',
    loadComponent: () =>
      import('../app/pages/feed-page/feed-page.component').then((c) => c.FeedPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/my-profile-page/my-profile-page.component').then(
        (c) => c.MyProfilePageComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
