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
    <div class="public-shell min-h-screen flex flex-col pt-8">
      <div class="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <header
          class="topbar w-full max-w-5xl surface border border-white/60 shadow-xl rounded-full px-6 py-3 backdrop-blur-xl bg-white/70 flex items-center justify-between pointer-events-auto transition-all duration-300"
        >
          <div class="shrink-0 scale-90 sm:scale-100 origin-left">
            <app-brand-mark />
          </div>

          <nav class="topbar__nav hidden md:flex items-center gap-1.5" aria-label="Primary">
            <a
              routerLink="/"
              routerLinkActive="!bg-amber-900/10 !text-amber-900 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-amber-900 hover:bg-black/5 transition-colors"
              >Overview</a
            >
            <a
              routerLink="/rooms"
              routerLinkActive="!bg-amber-900/10 !text-amber-900 font-semibold"
              class="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-amber-900 hover:bg-black/5 transition-colors"
              >Rooms</a
            >
          </nav>

          <div class="flex items-center gap-3">
            @if (user()) {
              <a
                [routerLink]="dashboardPath()"
                class="text-sm font-semibold text-amber-800 hover:text-amber-950 px-4 py-2 hidden sm:inline-block"
                >Dashboard</a
              >
              <button
                type="button"
                class="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
                  class="mr-2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign out
              </button>
            } @else {
              <a
                routerLink="/auth/login"
                class="text-sm font-semibold text-neutral-600 hover:text-amber-800 px-4 py-2 hidden sm:inline-block transition-colors"
                >Log in</a
              >
              <a
                routerLink="/auth/register"
                class="button !py-2.5 !text-sm shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200"
              >
                Book your stay
              </a>
            }
          </div>
        </header>
      </div>

      <main class="flex-1 mt-20 sm:mt-24">
        <router-outlet />
      </main>

      <footer class="site-footer bg-white border-t border-amber-900/10 mt-20">
        <div class="container py-12 md:py-16">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            <div class="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
              <div class="scale-90 origin-left">
                <app-brand-mark />
              </div>
              <p class="text-neutral-500 text-sm leading-relaxed max-w-sm">
                StayWise pairs guest-facing hospitality with powerful operational control. Built for
                modern single-property hotels seeking unified management solutions.
              </p>
            </div>

            <div
              class="md:col-span-7 lg:col-span-8 flex flex-col sm:flex-row gap-8 justify-between lg:justify-end md:ml-auto w-full"
            >
              <div class="flex flex-col gap-4 min-w-35">
                <h4 class="font-bold text-neutral-900 mb-1">Guests</h4>
                <a
                  routerLink="/rooms"
                  class="text-sm text-neutral-500 hover:text-amber-800 transition-colors"
                  >Search Rooms</a
                >
                <a
                  routerLink="/auth/register"
                  class="text-sm text-neutral-500 hover:text-amber-800 transition-colors"
                  >Create Account</a
                >
                <a
                  routerLink="/auth/login"
                  class="text-sm text-neutral-500 hover:text-amber-800 transition-colors"
                  >Guest Sign In</a
                >
              </div>

              <div class="flex flex-col gap-4 min-w-35">
                <h4 class="font-bold text-neutral-900 mb-1">Staff Portal</h4>
                <a
                  routerLink="/auth/login"
                  class="text-sm text-neutral-500 hover:text-amber-800 transition-colors"
                  >Reception</a
                >
                <a
                  routerLink="/auth/login"
                  class="text-sm text-neutral-500 hover:text-amber-800 transition-colors"
                  >Housekeeping</a
                >
                <a
                  routerLink="/auth/login"
                  class="text-sm text-neutral-500 hover:text-amber-800 transition-colors"
                  >Management</a
                >
              </div>

              <div
                class="flex flex-col gap-4 bg-orange-50/50 p-5 rounded-2xl border border-amber-900/5 max-w-xs"
              >
                <div class="flex items-center gap-2">
                  <span class="relative flex h-3 w-3">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                    ></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <h4 class="font-bold text-amber-900 mb-0">System Info</h4>
                </div>
                <p class="text-xs text-amber-800/80 leading-relaxed">
                  For demonstration, all seeded staff accounts utilize the password:<br />
                  <strong
                    class="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-900/10 inline-block mt-1"
                    >Password@123</strong
                  >
                </p>
              </div>
            </div>
          </div>

          <div
            class="flex flex-col sm:flex-row items-center justify-between pt-8 mt-12 border-t border-black/5 text-xs text-neutral-400 gap-4"
          >
            <p>&copy; {{ currentYear }} StayWise Hotel Management. All rights reserved.</p>
            <div class="flex items-center gap-4">
              <a href="#" class="hover:text-amber-800 transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-amber-800 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.user;
  readonly currentYear = new Date().getFullYear();
  readonly dashboardPath = computed(() => {
    const role = this.user()?.role;
    return role ? dashboardRouteByRole[role] : '/guest';
  });
}
