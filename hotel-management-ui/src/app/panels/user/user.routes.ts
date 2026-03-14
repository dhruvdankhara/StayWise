import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout.component';
import { HomePageComponent } from './home-page.component';
import { GuestBookingsPageComponent } from './guest-bookings-page.component';
import { GuestOverviewPageComponent } from './guest-overview-page.component';
import { GuestProfilePageComponent } from './guest-profile-page.component';
import { GuestReviewsPageComponent } from './guest-reviews-page.component';
import { RoomSearchPageComponent } from './room-search-page.component';

export const userRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'rooms', component: RoomSearchPageComponent },
  {
    path: 'guest',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['guest'])],
    children: [
      { path: '', component: GuestOverviewPageComponent },
      { path: 'bookings', component: GuestBookingsPageComponent },
      { path: 'profile', component: GuestProfilePageComponent },
      { path: 'reviews', component: GuestReviewsPageComponent }
    ]
  }
];
