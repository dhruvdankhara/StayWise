import type { NavItem, UserRole } from './app.models';

export const dashboardRouteByRole: Record<UserRole, string> = {
  admin: '/admin',
  receptionist: '/receptionist',
  cleaning_staff: '/cleaning-staff',
  guest: '/guest',
};

export const navigationByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Overview', path: '/admin' },
    { label: 'Staff', path: '/admin/staff' },
    { label: 'Rooms', path: '/admin/rooms' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: 'Settings', path: '/admin/settings' },
  ],
  receptionist: [
    { label: 'Overview', path: '/receptionist' },
    { label: 'Guests', path: '/receptionist/guests' },
    { label: 'Bookings', path: '/receptionist/bookings' },
    { label: 'Check-in', path: '/receptionist/check-in' },
    { label: 'Check-out', path: '/receptionist/check-out' },
    { label: 'Billing', path: '/receptionist/billing' },
    { label: 'Housekeeping', path: '/receptionist/housekeeping' },
  ],
  cleaning_staff: [
    { label: 'Overview', path: '/cleaning-staff' },
    { label: 'Tasks', path: '/cleaning-staff/tasks' },
  ],
  guest: [
    { label: 'Overview', path: '/guest' },
    { label: 'Bookings', path: '/guest/bookings' },
    { label: 'Reviews', path: '/guest/reviews' },
    { label: 'Profile', path: '/guest/profile' },
    // { label: 'Issues', path: '/guest/issues' },
  ],
};
