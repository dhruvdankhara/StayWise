import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'rooms',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/forgot-password',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth/reset-password',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/verify-email',
    renderMode: RenderMode.Server
  },
  {
    path: 'rooms/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'booking/:roomId',
    renderMode: RenderMode.Server
  },
  {
    path: 'booking/confirmation/:bookingId',
    renderMode: RenderMode.Server
  },
  {
    path: 'guest',
    renderMode: RenderMode.Server
  },
  {
    path: 'guest/bookings',
    renderMode: RenderMode.Server
  },
  {
    path: 'guest/bookings/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'guest/profile',
    renderMode: RenderMode.Server
  },
  {
    path: 'guest/reviews',
    renderMode: RenderMode.Server
  },
  {
    path: 'guest/issues',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/staff',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/rooms',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/bookings',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/reports',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/settings',
    renderMode: RenderMode.Server
  },
  {
    path: 'hotel-manager',
    renderMode: RenderMode.Server
  },
  {
    path: 'hotel-manager/bookings',
    renderMode: RenderMode.Server
  },
  {
    path: 'hotel-manager/rooms',
    renderMode: RenderMode.Server
  },
  {
    path: 'hotel-manager/housekeeping',
    renderMode: RenderMode.Server
  },
  {
    path: 'hotel-manager/reports',
    renderMode: RenderMode.Server
  },
  {
    path: 'receptionist',
    renderMode: RenderMode.Server
  },
  {
    path: 'receptionist/bookings',
    renderMode: RenderMode.Server
  },
  {
    path: 'receptionist/check-in',
    renderMode: RenderMode.Server
  },
  {
    path: 'receptionist/check-out',
    renderMode: RenderMode.Server
  },
  {
    path: 'receptionist/billing',
    renderMode: RenderMode.Server
  },
  {
    path: 'receptionist/guests',
    renderMode: RenderMode.Server
  },
  {
    path: 'cleaning-staff',
    renderMode: RenderMode.Server
  },
  {
    path: 'cleaning-staff/tasks',
    renderMode: RenderMode.Server
  },
  {
    path: 'cleaning-staff/tasks/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
