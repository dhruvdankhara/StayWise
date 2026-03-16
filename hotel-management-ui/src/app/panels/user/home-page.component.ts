import { RoomService } from '../../core/services/room.service';
import { SettingsService } from '../../core/services/settings.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="animate-fade-in pb-20">
        <section
          class="hero container relative pt-12 pb-24 lg:pt-24 lg:pb-32 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center"
        >
          <div class="flex-1 space-y-8 z-10">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-2"
            >
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <p class="eyebrow !m-0 !text-xs text-amber-800">
                Luxury hospitality, unified operations
              </p>
            </div>

            <h1
              class="text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
            >
              <span class="text-amber-700">{{ vm.settings.name }}</span> powers your entire hotel
              from one central system.
            </h1>

            <p class="lede text-lg lg:text-xl text-neutral-600 max-w-2xl leading-relaxed">
              Guests browse rooms and manage stays, while staff handle check-in, billing,
              housekeeping, and analytics through beautiful, role-based panels.
            </p>

            <div class="button-row pt-4">
              <a
                routerLink="/rooms"
                class="button shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  ></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Explore rooms
              </a>
              <a
                routerLink="/auth/login"
                class="button button--ghost hover:bg-neutral-900/5 transition-colors duration-200"
              >
                Open your panel
              </a>
            </div>
          </div>

          <div class="flex-1 w-full max-w-md relative z-10">
            <div
              class="absolute -top-10 -right-10 w-72 h-72 bg-amber-600/20 rounded-full blur-[80px] z-0"
            ></div>

            <div
              class="hero-card surface relative z-10 border border-white/40 shadow-2xl overflow-hidden rounded-[2rem] p-8 backdrop-blur-xl bg-orange-50/60"
            >
              <div class="flex items-center gap-3 mb-8">
                <div
                  class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <p class="eyebrow !m-0">Hotel Profile</p>
              </div>

              <div class="stack-list space-y-6">
                <div
                  class="group p-4 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors border border-black/5"
                >
                  <strong class="block text-neutral-900 text-lg mb-1">{{
                    vm.settings.contactPhone
                  }}</strong>
                  <span class="text-neutral-600 text-sm flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {{ vm.settings.address }}
                  </span>
                </div>
                <div
                  class="group p-4 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors border border-black/5"
                >
                  <strong class="block text-neutral-900 text-lg mb-1"
                    >Check-in {{ vm.settings.checkInTime }}</strong
                  >
                  <span class="text-neutral-600 text-sm flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Check-out {{ vm.settings.checkOutTime }} 
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="section container mt-12">
          <div
            class="section-heading flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2">
                <p class="eyebrow !m-0 text-amber-800">Available room inventory</p>
              </div>
              <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                Book directly into <br class="hidden md:block" />
                live availability.
              </h2>
            </div>
            <a
              routerLink="/rooms"
              class="inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-950 transition-colors group px-4 py-2 rounded-full hover:bg-amber-900/5"
            >
              View all rooms
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
                class="group-hover:translate-x-1 transition-transform"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          <div class="card-grid pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (room of vm.rooms; track room.id) {
              <article
                class="surface listing-card group flex flex-col h-full bg-white/40 border border-white/50 rounded-[2rem] overflow-hidden hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 !p-0"
              >
                <div
                  class="relative h-48 sm:h-56 w-full bg-neutral-100 overflow-hidden border-b border-black/5"
                >
                  <div
                    class="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-300"
                  >
                    <!--  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg> -->
                    <img
                      [src]="room.images[0]"
                      alt="{{ room.type }}"
                      class="object-cover w-full h-full"
                    />
                  </div>
                  <div class="absolute top-4 left-4">
                    <span
                      class="pill inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider rounded-full shadow-sm"
                      [class.text-emerald-700]="room.status === 'AVAILABLE'"
                      [class.text-amber-700]="room.status !== 'AVAILABLE'"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        [class.bg-emerald-500]="room.status === 'AVAILABLE'"
                        [class.bg-amber-500]="room.status !== 'AVAILABLE'"
                      ></span>
                      {{ room.status }}
                    </span>
                  </div>
                </div>

                <div class="p-6 flex-1 flex flex-col">
                  <h3
                    class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-amber-800 transition-colors"
                  >
                    {{ room.type }}
                  </h3>
                  <p class="text-neutral-600 text-sm line-clamp-2 mb-6 flex-1">
                    {{
                      room.description ||
                        'Thoughtfully prepared for premium comfort and efficient operations.'
                    }}
                  </p>

                  <div
                    class="grid grid-cols-2 gap-y-3 gap-x-4 mb-8 text-sm text-neutral-600 bg-black/5 p-4 rounded-2xl"
                  >
                    <div class="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-amber-700/70"
                      >
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        ></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Room {{ room.roomNumber }}
                    </div>
                    <div class="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-amber-700/70"
                      >
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <path d="M9 22v-4h6v4"></path>
                        <path d="M8 6h.01"></path>
                        <path d="M16 6h.01"></path>
                        <path d="M12 6h.01"></path>
                        <path d="M12 10h.01"></path>
                        <path d="M12 14h.01"></path>
                        <path d="M16 10h.01"></path>
                        <path d="M16 14h.01"></path>
                        <path d="M8 10h.01"></path>
                        <path d="M8 14h.01"></path>
                      </svg>
                      Floor {{ room.floor }}
                    </div>
                    <div class="flex items-center gap-2 col-span-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-amber-700/70"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {{ room.capacity }} guest capacity
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-black/5">
                    <strong class="text-2xl text-neutral-900"
                      >{{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0'
                      }}<span class="text-sm font-normal text-neutral-500">/night</span></strong
                    >
                    <a
                      [routerLink]="['/rooms', room.id]"
                      class="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium transition-colors"
                    >
                      Details
                    </a>
                  </div>
                </div>
              </article>
            }
          </div>
        </section>
      </div>
    }
  `,
})
export class HomePageComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly roomService = inject(RoomService);

  readonly vm$ = combineLatest({
    settings: this.settingsService.getSettings(),
    rooms: this.roomService.listRooms({ limit: 3 }),
  });
}
