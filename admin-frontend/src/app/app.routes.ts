import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users').then(m => m.Users)
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics/analytics').then(m => m.Analytics)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];