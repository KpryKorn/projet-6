import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { postResolver } from '@services/post/post.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/auth/pages/home-page/home-page.component').then(
        (c) => c.HomePageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/features/auth/pages/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/features/auth/pages/register-page/register-page.component').then(
        (c) => c.RegisterPageComponent
      ),
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('../app/features/feed/pages/feed-page/feed-page.component').then(
        (c) => c.FeedPageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('../app/features/posts/pages/posts-page/posts-page.component').then(
        (c) => c.PostsPageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'posts/:postId',
    loadComponent: () =>
      import('../app/features/posts/pages/post-id-page/post-id-page.component').then(
        (c) => c.PostIdPageComponent
      ),
    canActivate: [authGuard],
    resolve: {
      post: postResolver,
    },
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../app/features/profile/pages/my-profile-page/my-profile-page.component').then(
        (c) => c.MyProfilePageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'subjects',
    loadComponent: () =>
      import('../app/features/subjects/pages/subjects-page/subjects-page.component').then(
        (c) => c.SubjectsPageComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
