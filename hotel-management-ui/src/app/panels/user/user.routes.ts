import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { HomePageComponent } from './home-page.component';
import { BookingCheckoutPageComponent } from './booking-checkout-page.component';
import { BookingConfirmationPageComponent } from './booking-confirmation-page.component';
import { GuestBookingDetailPageComponent } from './guest-booking-detail-page.component';
import { GuestBookingsPageComponent } from './guest-bookings-page.component';
import { GuestIssuesPageComponent } from './guest-issues-page.component';
import { GuestOverviewPageComponent } from './guest-overview-page.component';
import { GuestProfilePageComponent } from './guest-profile-page.component';
import { GuestReviewsPageComponent } from './guest-reviews-page.component';
import { RoomDetailPageComponent } from './room-detail-page.component';
import { RoomSearchPageComponent } from './room-search-page.component';
import { PublicLayoutComponent } from '../../layouts/public-layout.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'rooms', component: RoomSearchPageComponent },
      { path: 'rooms/:id', component: RoomDetailPageComponent },
      {
        path: 'booking/:roomId',
        component: BookingCheckoutPageComponent,
        canActivate: [authGuard, roleGuard(['guest'])],
      },
      {
        path: 'booking/confirmation/:bookingId',
        component: BookingConfirmationPageComponent,
        canActivate: [authGuard, roleGuard(['guest'])],
      },
    ],
  },
  {
    path: 'guest',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['guest'])],
    children: [
      { path: '', component: GuestOverviewPageComponent },
      { path: 'bookings', component: GuestBookingsPageComponent },
      { path: 'bookings/:id', component: GuestBookingDetailPageComponent },
      { path: 'profile', component: GuestProfilePageComponent },
      { path: 'reviews', component: GuestReviewsPageComponent },
      { path: 'issues', component: GuestIssuesPageComponent },
    ],
  },
];
