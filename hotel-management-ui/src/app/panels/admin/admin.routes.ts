import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { AdminDashboardPageComponent } from './admin-dashboard-page.component';
import { AdminReportsPageComponent } from './admin-reports-page.component';
import { AdminRoomsPageComponent } from './admin-rooms-page.component';
import { AdminStaffPageComponent } from './admin-staff-page.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', component: AdminDashboardPageComponent },
      { path: 'staff', component: AdminStaffPageComponent },
      { path: 'rooms', component: AdminRoomsPageComponent },
      { path: 'reports', component: AdminReportsPageComponent }
    ]
  }
];
