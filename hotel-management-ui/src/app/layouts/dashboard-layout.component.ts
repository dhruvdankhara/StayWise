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
    <div class="min-h-screen bg-neutral-100 flex flex-col lg:flex-row font-sans">
      <!-- Sidebar / Layout Nav -->
      <aside
        class="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-black/5 flex flex-col shrink-0 lg:h-screen lg:sticky lg:top-0 z-20 shadow-sm relative"
      >
        <div class="p-6 border-b border-black/5 flex items-center justify-between">
          <app-brand-mark />
        </div>

        <!-- Profile Profile Chip -->
        <div class="p-6 border-b border-black/5 bg-linear-to-br from-amber-50/50 to-orange-50/20">
          <p class="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4">
            Signed in as
          </p>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-800 font-bold uppercase shrink-0 border border-amber-100 shadow-sm text-lg"
            >
              @if (user()?.profileImage?.toString()) {
                <img
                  [src]="user()?.profileImage"
                  alt="Avatar"
                  class="w-full h-full object-cover rounded-full"
                />
              } @else {
                {{ user()?.name?.charAt(0) || 'U' }}
              }
            </div>
            <div class="overflow-hidden">
              <strong class="block text-sm font-bold text-neutral-900 truncate mb-0.5">{{
                user()?.name
              }}</strong>
              <span class="block text-xs text-neutral-500 truncate">{{ user()?.email }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop/Mobile Navigation -->
        <nav class="flex-1 overflow-y-auto w-full p-4 space-y-1.5" aria-label="Panel navigation">
          @for (item of navItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all border border-transparent"
            >
              <!-- <div class="w-5 h-5 flex items-center justify-center opacity-60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg> 
              </div> -->
              {{ item.label }}
            </a>
          }
        </nav>

        <!-- Logout Action -->
        <div class="p-4 border-t border-black/5 bg-neutral-50/50">
          <button
            type="button"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-neutral-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-2xl transition-all"
            (click)="authService.logout()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <!-- Dashboard Main Shell -->
      <main class="flex-1 overflow-hidden relative min-h-screen">
        <div
          class="absolute top-0 right-0 w-125 h-125 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-100 h-100 bg-orange-400/5 blur-[100px] rounded-full pointer-events-none -z-10"
        ></div>
        <div class="h-full overflow-y-auto p-4 md:p-8 lg:p-12 z-10 relative">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class DashboardLayoutComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.user;
  readonly navItems = computed(() => navigationByRole[this.user()?.role ?? 'guest']);
}
