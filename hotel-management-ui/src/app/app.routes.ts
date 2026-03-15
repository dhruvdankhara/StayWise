import { Routes } from '@angular/router';

import { guestGuard } from './core/guards/guest.guard';
import { PublicLayoutComponent } from './layouts/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./panels/user/user.routes').then((module) => module.userRoutes),
  },
  {
    path: 'auth',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./auth/login-page.component').then((module) => module.LoginPageComponent),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./auth/register-page.component').then((module) => module.RegisterPageComponent),
      },
      {
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./auth/forgot-password-page.component').then(
            (module) => module.ForgotPasswordPageComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./panels/admin/admin.routes').then((module) => module.adminRoutes),
  },
  {
    path: 'hotel-manager',
    loadChildren: () =>
      import('./panels/hotel-manager/hotel-manager.routes').then(
        (module) => module.hotelManagerRoutes,
      ),
  },
  {
    path: 'receptionist',
    loadChildren: () =>
      import('./panels/receptionist/receptionist.routes').then(
        (module) => module.receptionistRoutes,
      ),
  },
  {
    path: 'cleaning-staff',
    loadChildren: () =>
      import('./panels/cleaning-staff/cleaning-staff.routes').then(
        (module) => module.cleaningStaffRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
