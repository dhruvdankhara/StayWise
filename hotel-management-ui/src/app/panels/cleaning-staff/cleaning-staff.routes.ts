import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { CleanerDashboardPageComponent } from './cleaner-dashboard-page.component';
import { CleanerTaskDetailPageComponent } from './cleaner-task-detail-page.component';
import { CleanerTasksListPageComponent } from './cleaner-tasks-list-page.component';

export const cleaningStaffRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['cleaning_staff'])],
    children: [
      {
        path: '',
        component: CleanerDashboardPageComponent,
        data: {
          eyebrow: 'Housekeeping',
          title: 'Assigned turnover and room readiness tasks.',
          description: 'Track open work items and move tasks through the cleaning workflow.'
        }
      },
      { path: 'tasks', component: CleanerTasksListPageComponent },
      { path: 'tasks/:id', component: CleanerTaskDetailPageComponent }
    ]
  }
];
