import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { AdminBookingsPageComponent } from './admin-bookings-page.component';
import { AdminDashboardPageComponent } from './admin-dashboard-page.component';
import { AdminReportsPageComponent } from './admin-reports-page.component';
import { AdminRoomsPageComponent } from './admin-rooms-page.component';
import { AdminSettingsPageComponent } from './admin-settings-page.component';
import { AdminStaffPageComponent } from './admin-staff-page.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      {
        path: '',
        component: AdminDashboardPageComponent,
        data: {
          eyebrow: 'Administration',
          title: 'Executive control across hotel operations.',
          description: 'Monitor rooms, reservations, and housekeeping throughput from one dashboard.'
        }
      },
      { path: 'staff', component: AdminStaffPageComponent },
      {
        path: 'rooms',
        component: AdminRoomsPageComponent,
        data: {
          eyebrow: 'Inventory control',
          title: 'Room inventory, pricing, and visual merchandising.',
          description: 'Manage active room types, operational status, and uploaded media.'
        }
      },
      {
        path: 'bookings',
        component: AdminBookingsPageComponent,
        data: {
          eyebrow: 'Reservations',
          title: 'Reservation governance and booking interventions.',
          description: 'Create, edit, and cancel bookings with live property data.'
        }
      },
      {
        path: 'reports',
        component: AdminReportsPageComponent,
        data: {
          eyebrow: 'Analytics',
          title: 'Occupancy, revenue, staff, and guest reporting.',
          description: 'Review live report payloads and export management documents.',
          adminOnly: true
        }
      },
      { path: 'settings', component: AdminSettingsPageComponent }
    ]
  }
];
