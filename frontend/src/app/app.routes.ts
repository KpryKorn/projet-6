import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadComponent: () =>
      import('../app/components/post/post.component').then((c) => c.PostComponent),
  },
];
