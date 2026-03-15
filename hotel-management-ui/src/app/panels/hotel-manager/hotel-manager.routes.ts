import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { ManagerBookingsPageComponent } from './manager-bookings-page.component';
import { ManagerHousekeepingPageComponent } from './manager-housekeeping-page.component';
import { ManagerDashboardPageComponent } from './manager-dashboard-page.component';
import { ManagerReportsPageComponent } from './manager-reports-page.component';
import { ManagerRoomsPageComponent } from './manager-rooms-page.component';

export const hotelManagerRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['hotel_manager'])],
    children: [
      {
        path: '',
        component: ManagerDashboardPageComponent,
        data: {
          eyebrow: 'Hotel management',
          title: 'Coordinate bookings, rooms, and service readiness.',
          description: 'Track daily occupancy and keep turnover work aligned with front desk demand.'
        }
      },
      {
        path: 'bookings',
        component: ManagerBookingsPageComponent,
        data: {
          eyebrow: 'Reservations',
          title: 'Live booking operations for the property manager.',
          description: 'Supervise arrivals, changes, and cancellations across the reservation pipeline.'
        }
      },
      {
        path: 'rooms',
        component: ManagerRoomsPageComponent,
        data: {
          eyebrow: 'Room operations',
          title: 'Room availability, pricing, and maintenance state.',
          description: 'Update room status and commercial details without leaving the dashboard.'
        }
      },
      { path: 'housekeeping', component: ManagerHousekeepingPageComponent },
      {
        path: 'reports',
        component: ManagerReportsPageComponent,
        data: {
          eyebrow: 'Performance',
          title: 'Occupancy and revenue snapshots.',
          description: 'Focused commercial reporting for the hotel manager.'
        }
      }
    ]
  }
];
