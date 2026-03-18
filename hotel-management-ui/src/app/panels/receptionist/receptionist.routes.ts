import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { ReceptionistBillingPageComponent } from './receptionist-billing-page.component';
import { ReceptionistBookingsPageComponent } from './receptionist-bookings-page.component';
import { ReceptionistCheckInPageComponent } from './receptionist-check-in-page.component';
import { ReceptionistCheckOutPageComponent } from './receptionist-check-out-page.component';
import { ReceptionistGuestsPageComponent } from './receptionist-guests-page.component';
import { ReceptionistHousekeepingPageComponent } from './receptionist-housekeeping-page.component';
import { ReceptionistDashboardPageComponent } from './receptionist-dashboard-page.component';

export const receptionistRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['receptionist'])],
    children: [
      {
        path: '',
        component: ReceptionistDashboardPageComponent,
        data: {
          eyebrow: 'Front desk',
          title: 'Arrivals, departures, and guest servicing.',
          description: 'Work the live reservation queue and keep reception synchronized with operations.'
        }
      },
      {
        path: 'bookings',
        component: ReceptionistBookingsPageComponent,
        data: {
          eyebrow: 'Reservation desk',
          title: 'Manage reservations and guest requests.',
          description: 'Create walk-ins, edit bookings, and capture special stay requirements.'
        }
      },
      { path: 'check-in', component: ReceptionistCheckInPageComponent },
      { path: 'check-out', component: ReceptionistCheckOutPageComponent },
      { path: 'billing', component: ReceptionistBillingPageComponent },
      { path: 'guests', component: ReceptionistGuestsPageComponent },
      {
        path: 'housekeeping',
        component: ReceptionistHousekeepingPageComponent,
        data: {
          eyebrow: 'Operations',
          title: 'Housekeeping task management.',
          description: 'Assign, reprioritize, and track room cleaning and maintenance tasks.'
        }
      }
    ]
  }
];
