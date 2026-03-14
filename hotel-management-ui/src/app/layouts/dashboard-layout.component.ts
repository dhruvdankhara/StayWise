import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import type { NavItem, UserRole } from '../core/models/app.models';
import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

const navigationByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Overview', path: '/admin' },
    { label: 'Staff', path: '/admin/staff' },
    { label: 'Rooms', path: '/admin/rooms' },
    { label: 'Reports', path: '/admin/reports' }
  ],
  hotel_manager: [{ label: 'Overview', path: '/hotel-manager' }],
  receptionist: [{ label: 'Overview', path: '/receptionist' }],
  cleaning_staff: [{ label: 'Overview', path: '/cleaning-staff' }],
  guest: [
    { label: 'Overview', path: '/guest' },
    { label: 'My Bookings', path: '/guest/bookings' },
    { label: 'Profile', path: '/guest/profile' },
    { label: 'Reviews', path: '/guest/reviews' }
  ]
};

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-shell">
      <aside class="dashboard-sidebar surface">
        <app-brand-mark />
        <div class="profile-chip">
          <p class="eyebrow">Signed in as</p>
          <strong>{{ user()?.name }}</strong>
          <span>{{ user()?.email }}</span>
        </div>
        <nav class="sidebar-nav" aria-label="Panel navigation">
          @for (item of navItems(); track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: item.path.endsWith('guest') || item.path === '/admin' || item.path === '/hotel-manager' || item.path === '/receptionist' || item.path === '/cleaning-staff' }">{{ item.label }}</a>
          }
        </nav>
        <button type="button" class="button button--ghost" (click)="authService.logout()">Sign out</button>
      </aside>
      <main class="dashboard-main">
        <router-outlet />
      </main>
    </div>
  `
})
export class DashboardLayoutComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.user;
  readonly navItems = computed(() => navigationByRole[this.user()?.role ?? 'guest']);
}
