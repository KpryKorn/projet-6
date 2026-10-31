import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [guestGuard],
    title: 'MDD, des devs qui partagent ce qu’ils apprennent',
    loadComponent: () => import('./features/landing/pages/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Connexion · MDD',
    loadComponent: () => import('./features/auth/pages/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    title: 'Créer un compte · MDD',
    loadComponent: () => import('./features/auth/pages/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    title: 'Choisis tes thèmes · MDD',
    loadComponent: () =>
      import('./features/subjects/pages/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    title: 'Fil d’actualité · MDD',
    loadComponent: () => import('./features/feed/pages/feed.page').then((m) => m.FeedPage),
  },
  {
    path: 'posts/new',
    canActivate: [authGuard],
    title: 'Nouvel article · MDD',
    loadComponent: () => import('./features/posts/pages/composer.page').then((m) => m.ComposerPage),
  },
  {
    path: 'posts/:id/edit',
    canActivate: [authGuard],
    title: 'Modifier l’article · MDD',
    loadComponent: () => import('./features/posts/pages/composer.page').then((m) => m.ComposerPage),
  },
  {
    path: 'posts/:id',
    canActivate: [authGuard],
    title: 'Article · MDD',
    loadComponent: () =>
      import('./features/posts/pages/post-detail.page').then((m) => m.PostDetailPage),
  },
  {
    path: 'subjects',
    canActivate: [authGuard],
    title: 'Thèmes · MDD',
    loadComponent: () =>
      import('./features/subjects/pages/subjects.page').then((m) => m.SubjectsPage),
  },
  {
    path: 'subjects/:id',
    canActivate: [authGuard],
    title: 'Thème · MDD',
    loadComponent: () =>
      import('./features/subjects/pages/subject-detail.page').then((m) => m.SubjectDetailPage),
  },
  {
    path: 'u/:id',
    canActivate: [authGuard],
    title: 'Profil · MDD',
    loadComponent: () =>
      import('./features/profile/pages/public-profile.page').then((m) => m.PublicProfilePage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    title: 'Mon profil · MDD',
    loadComponent: () => import('./features/profile/pages/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'legal',
    title: 'Mentions légales · MDD',
    loadComponent: () => import('./features/legal/pages/legal.page').then((m) => m.LegalPage),
  },
  {
    path: '**',
    title: 'Page introuvable · MDD',
    loadComponent: () =>
      import('./features/not-found/pages/not-found.page').then((m) => m.NotFoundPage),
  },
];
