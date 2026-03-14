import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { ReceptionistDashboardPageComponent } from './receptionist-dashboard-page.component';

export const receptionistRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['receptionist'])],
    children: [{ path: '', component: ReceptionistDashboardPageComponent }]
  }
];
