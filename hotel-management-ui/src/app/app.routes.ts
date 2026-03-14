import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layouts/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    loadChildren: () => import('./panels/user/user.routes').then((module) => module.userRoutes)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login-page.component').then((module) => module.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register-page.component').then((module) => module.RegisterPageComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./auth/forgot-password-page.component').then((module) => module.ForgotPasswordPageComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./auth/reset-password-page.component').then((module) => module.ResetPasswordPageComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./auth/verify-email-page.component').then((module) => module.VerifyEmailPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./panels/admin/admin.routes').then((module) => module.adminRoutes)
  },
  {
    path: 'hotel-manager',
    loadChildren: () => import('./panels/hotel-manager/hotel-manager.routes').then((module) => module.hotelManagerRoutes)
  },
  {
    path: 'receptionist',
    loadChildren: () => import('./panels/receptionist/receptionist.routes').then((module) => module.receptionistRoutes)
  },
  {
    path: 'cleaning-staff',
    loadChildren: () => import('./panels/cleaning-staff/cleaning-staff.routes').then((module) => module.cleaningStaffRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
