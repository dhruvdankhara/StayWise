import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { navigationByRole } from '../core/models/navigation';
import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

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
            <a [routerLink]="item.path" routerLinkActive="active-link">{{ item.label }}</a>
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
