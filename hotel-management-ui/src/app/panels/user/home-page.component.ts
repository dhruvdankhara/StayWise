import { RoomService } from '../../core/services/room.service';
import { SettingsService } from '../../core/services/settings.service';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { RoomListingCardComponent } from '../../shared/components/room-listing-card.component';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, RouterLink, RoomListingCardComponent],
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
              <!-- <span style="color: var(--accent) !important">{{ vm.settings.name }}</span> powers your entire hotel -->
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
              <app-room-listing-card
                [room]="room"
                [descriptionFallback]="'Thoughtfully prepared for premium comfort and efficient operations.'"
              />
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
