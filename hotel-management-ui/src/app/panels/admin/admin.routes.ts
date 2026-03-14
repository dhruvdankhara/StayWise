import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { BookingWorkspacePageComponent } from '../../shared/components/booking-workspace-page.component';
import { OperationsDashboardPageComponent } from '../../shared/components/operations-dashboard-page.component';
import { ReportWorkspacePageComponent } from '../../shared/components/report-workspace-page.component';
import { RoomWorkspacePageComponent } from '../../shared/components/room-workspace-page.component';
import { SettingsWorkspacePageComponent } from '../../shared/components/settings-workspace-page.component';
import { StaffWorkspacePageComponent } from '../../shared/components/staff-workspace-page.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      {
        path: '',
        component: OperationsDashboardPageComponent,
        data: {
          eyebrow: 'Administration',
          title: 'Executive control across hotel operations.',
          description: 'Monitor rooms, reservations, and housekeeping throughput from one dashboard.'
        }
      },
      { path: 'staff', component: StaffWorkspacePageComponent },
      {
        path: 'rooms',
        component: RoomWorkspacePageComponent,
        data: {
          eyebrow: 'Inventory control',
          title: 'Room inventory, pricing, and visual merchandising.',
          description: 'Manage active room types, operational status, and uploaded media.'
        }
      },
      {
        path: 'bookings',
        component: BookingWorkspacePageComponent,
        data: {
          eyebrow: 'Reservations',
          title: 'Reservation governance and booking interventions.',
          description: 'Create, edit, and cancel bookings with live property data.'
        }
      },
      {
        path: 'reports',
        component: ReportWorkspacePageComponent,
        data: {
          eyebrow: 'Analytics',
          title: 'Occupancy, revenue, staff, and guest reporting.',
          description: 'Review live report payloads and export management documents.',
          adminOnly: true
        }
      },
      { path: 'settings', component: SettingsWorkspacePageComponent }
    ]
  }
];
