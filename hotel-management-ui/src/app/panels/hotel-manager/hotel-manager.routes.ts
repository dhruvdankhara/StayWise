import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { BookingWorkspacePageComponent } from '../../shared/components/booking-workspace-page.component';
import { HousekeepingWorkspacePageComponent } from '../../shared/components/housekeeping-workspace-page.component';
import { OperationsDashboardPageComponent } from '../../shared/components/operations-dashboard-page.component';
import { ReportWorkspacePageComponent } from '../../shared/components/report-workspace-page.component';
import { RoomWorkspacePageComponent } from '../../shared/components/room-workspace-page.component';

export const hotelManagerRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['hotel_manager'])],
    children: [
      {
        path: '',
        component: OperationsDashboardPageComponent,
        data: {
          eyebrow: 'Hotel management',
          title: 'Coordinate bookings, rooms, and service readiness.',
          description: 'Track daily occupancy and keep turnover work aligned with front desk demand.'
        }
      },
      {
        path: 'bookings',
        component: BookingWorkspacePageComponent,
        data: {
          eyebrow: 'Reservations',
          title: 'Live booking operations for the property manager.',
          description: 'Supervise arrivals, changes, and cancellations across the reservation pipeline.'
        }
      },
      {
        path: 'rooms',
        component: RoomWorkspacePageComponent,
        data: {
          eyebrow: 'Room operations',
          title: 'Room availability, pricing, and maintenance state.',
          description: 'Update room status and commercial details without leaving the dashboard.'
        }
      },
      { path: 'housekeeping', component: HousekeepingWorkspacePageComponent },
      {
        path: 'reports',
        component: ReportWorkspacePageComponent,
        data: {
          eyebrow: 'Performance',
          title: 'Occupancy and revenue snapshots.',
          description: 'Focused commercial reporting for the hotel manager.'
        }
      }
    ]
  }
];
