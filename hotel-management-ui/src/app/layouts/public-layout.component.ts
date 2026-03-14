import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { dashboardRouteByRole } from '../core/models/navigation';
import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="public-shell">
      <header class="topbar container">
        <app-brand-mark />
        <nav class="topbar__nav" aria-label="Primary">
          <a routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }">Overview</a>
          <a routerLink="/rooms" routerLinkActive="active-link">Rooms</a>
          @if (user()) {
            <a [routerLink]="dashboardPath()">Dashboard</a>
            <button type="button" class="button button--ghost" (click)="authService.logout()">Sign out</button>
          } @else {
            <a routerLink="/auth/login" class="button button--ghost">Login</a>
            <a routerLink="/auth/register" class="button">Book your stay</a>
          }
        </nav>
      </header>
      <router-outlet />
      <footer class="site-footer container">
        <p>StayWise pairs guest-facing hospitality with operational control for a single-property hotel.</p>
        <p>Demo accounts use the password <strong>Password@123</strong>.</p>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.user;
  readonly dashboardPath = computed(() => {
    const role = this.user()?.role;
    return role ? dashboardRouteByRole[role] : '/guest';
  });
}
