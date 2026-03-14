import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { CleaningDashboardPageComponent } from './cleaning-dashboard-page.component';

export const cleaningStaffRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['cleaning_staff'])],
    children: [{ path: '', component: CleaningDashboardPageComponent }]
  }
];
