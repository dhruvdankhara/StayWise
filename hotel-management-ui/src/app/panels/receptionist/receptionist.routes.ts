import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { BillingWorkspacePageComponent } from '../../shared/components/billing-workspace-page.component';
import { BookingWorkspacePageComponent } from '../../shared/components/booking-workspace-page.component';
import { CheckInPageComponent } from '../../shared/components/check-in-page.component';
import { CheckOutPageComponent } from '../../shared/components/check-out-page.component';
import { GuestManagementPageComponent } from '../../shared/components/guest-management-page.component';
import { OperationsDashboardPageComponent } from '../../shared/components/operations-dashboard-page.component';

export const receptionistRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['receptionist'])],
    children: [
      {
        path: '',
        component: OperationsDashboardPageComponent,
        data: {
          eyebrow: 'Front desk',
          title: 'Arrivals, departures, and guest servicing.',
          description: 'Work the live reservation queue and keep reception synchronized with operations.'
        }
      },
      {
        path: 'bookings',
        component: BookingWorkspacePageComponent,
        data: {
          eyebrow: 'Reservation desk',
          title: 'Manage reservations and guest requests.',
          description: 'Create walk-ins, edit bookings, and capture special stay requirements.'
        }
      },
      { path: 'check-in', component: CheckInPageComponent },
      { path: 'check-out', component: CheckOutPageComponent },
      { path: 'billing', component: BillingWorkspacePageComponent },
      { path: 'guests', component: GuestManagementPageComponent }
    ]
  }
];
