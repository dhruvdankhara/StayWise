import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { OperationsDashboardPageComponent } from '../../shared/components/operations-dashboard-page.component';
import { TaskDetailPageComponent } from '../../shared/components/task-detail-page.component';
import { TaskListPageComponent } from '../../shared/components/task-list-page.component';

export const cleaningStaffRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['cleaning_staff'])],
    children: [
      {
        path: '',
        component: OperationsDashboardPageComponent,
        data: {
          eyebrow: 'Housekeeping',
          title: 'Assigned turnover and room readiness tasks.',
          description: 'Track open work items and move tasks through the cleaning workflow.'
        }
      },
      { path: 'tasks', component: TaskListPageComponent },
      { path: 'tasks/:id', component: TaskDetailPageComponent }
    ]
  }
];
