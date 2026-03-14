import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { ManagerDashboardPageComponent } from './manager-dashboard-page.component';

export const hotelManagerRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['hotel_manager'])],
    children: [{ path: '', component: ManagerDashboardPageComponent }]
  }
];
