import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';

import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-room-detail-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in pb-24 pt-8 text-left">
      @if (vm$ | async; as vm) {
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="mb-6">
            <a
              routerLink="/rooms"
              class="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-amber-800 transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-black/5 hover:bg-white w-fit"
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
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to search
            </a>
          </div>

          <div
            class="surface relative border border-white/60 shadow-xl rounded-[2.5rem] bg-white/80 backdrop-blur-xl overflow-hidden mb-16"
          >
            <div class="grid grid-cols-1 lg:grid-cols-12 max-w-full">
              <div
                class="lg:col-span-7 bg-neutral-100 flex flex-col items-center justify-center p-12 lg:p-20 min-h-[300px] border-b lg:border-b-0 lg:border-r border-black/5 text-neutral-300 relative"
              >
                <div
                  class="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-300"
                >
                  @if (vm.room.images && vm.room.images.length > 0) {
                    @if (!imageLoaded) {
                      <svg
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
                      </svg>
                    }

                    <img
                      [src]="vm.room.images[0]"
                      alt="{{ vm.room.type }}"
                      class="object-cover w-full h-full"
                      [class.hidden]="!imageLoaded"
                      (load)="onImageLoad()"
                      (error)="onImageError()"
                    />
                  } @else {
                    <svg
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
                    </svg>
                  }
                </div>
                <div class="absolute top-6 left-6">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider rounded-full shadow-sm"
                    [class.text-emerald-700]="vm.room.status === 'AVAILABLE'"
                    [class.text-amber-700]="vm.room.status !== 'AVAILABLE'"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      [class.bg-emerald-500]="vm.room.status === 'AVAILABLE'"
                      [class.bg-amber-500]="vm.room.status !== 'AVAILABLE'"
                    ></span>
                    {{ vm.room.status }}
                  </span>
                </div>
              </div>

              <div class="lg:col-span-5 p-8 lg:p-12 flex flex-col h-full bg-orange-50/30">
                <div class="flex-1">
                  <p class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3">
                    Room Information
                  </p>
                  <h1
                    class="text-3xl uppercase md:text-4xl font-bold tracking-tight text-neutral-900 mb-6"
                  >
                    {{ vm.room.type }}
                  </h1>
                  <p class="text-neutral-600 leading-relaxed mb-8">
                    {{
                      vm.room.description ||
                        'Premium stay configuration with live availability and booking support directly through our verified digital concierge.'
                    }}
                  </p>

                  <div
                    class="grid grid-cols-2 gap-y-4 gap-x-6 mb-10 pb-8 border-b border-black/10 text-sm text-neutral-700 font-medium"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm text-amber-700"
                      >
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
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          ></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      Room {{ vm.room.roomNumber }}
                    </div>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm text-amber-700"
                      >
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
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                          <path d="M9 22v-4h6v4"></path>
                        </svg>
                      </div>
                      Floor {{ vm.room.floor }}
                    </div>
                    <div class="flex items-center gap-3 col-span-2">
                      <div
                        class="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm text-amber-700"
                      >
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
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      {{ vm.room.capacity }} guest capacity
                    </div>
                  </div>
                </div>

                <div class="mt-auto">
                  <div class="flex items-end justify-between gap-6 mb-6">
                    <div>
                      <p class="text-sm font-semibold text-neutral-500 mb-1">Base Rate</p>
                      <strong class="text-3xl text-neutral-900 leading-none block"
                        >{{ vm.room.baseRate | currency: 'INR' : 'symbol' : '1.0-0'
                        }}<span class="text-sm font-normal text-neutral-500 ml-1"
                          >/night</span
                        ></strong
                      >
                    </div>
                  </div>
                  <a
                    [routerLink]="['/booking', vm.room.id]"
                    class="button w-full justify-center shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200 py-4 text-base bg-amber-800 hover:bg-amber-900 border-0 pointer-events-auto flex z-50"
                  >
                    <span class="mr-2">Reserve this room</span>
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
                      <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                      ></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <article class="md:col-span-1">
              <div
                class="w-12 h-12 rounded-2xl bg-orange-50 border border-amber-900/10 flex items-center justify-center text-amber-800 mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  ></polygon>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-neutral-900 mb-6">Amenities</h3>
              <div class="space-y-4">
                @for (amenity of vm.room.amenities; track amenity) {
                  <div
                    class="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm"
                  >
                    <div
                      class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <strong class="block text-sm font-bold text-neutral-900 mb-0.5">{{
                        amenity
                      }}</strong>
                      <span class="text-xs text-neutral-500">Included with stay</span>
                    </div>
                  </div>
                }
              </div>
            </article>

            <section class="md:col-span-2">
              <div
                class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 pb-4 border-b border-black/5"
              >
                <div>
                  <p class="eyebrow !m-0 !text-sm text-amber-800 mb-2">Visible Reviews</p>
                  <h2 class="text-3xl font-bold tracking-tight text-neutral-900">Guest Feedback</h2>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                @for (review of vm.reviews; track review.id) {
                  <article
                    class="surface flex flex-col h-full bg-white/60 border border-white/50 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 relative"
                  >
                    <div
                      class="absolute top-6 right-6 w-10 h-10 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm border border-amber-900/10"
                    >
                      {{ review.rating }}/5
                    </div>

                    <div class="flex items-center gap-3 mb-4 pr-12">
                      <div
                        class="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold uppercase overflow-hidden shrink-0"
                      >
                        {{ review.guest?.name?.charAt(0) || 'G' }}
                      </div>
                      <div>
                        <h3 class="font-bold text-neutral-900 text-sm m-0 leading-tight">
                          {{ review.guest?.name || 'Verified Guest' }}
                        </h3>
                        <p class="text-xs text-neutral-500 mt-0.5">Stayed in this room</p>
                      </div>
                    </div>

                    <p
                      class="text-neutral-600 text-sm leading-relaxed flex-1 pt-2 border-t border-black/5"
                    >
                      "{{
                        review.comment ||
                          'This guest left a rating but did not write any comments.'
                      }}"
                    </p>
                  </article>
                } @empty {
                  <article
                    class="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center surface border border-neutral-200/60 rounded-[2rem] bg-neutral-50/50 border-dashed"
                  >
                    <div
                      class="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-400 mb-4 border border-black/5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        ></path>
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold text-neutral-900 mb-2">No reviews yet</h3>
                    <p class="text-neutral-500 max-w-xs text-sm">
                      Be the first to experience this room setup and share your thoughts afterwards.
                    </p>
                  </article>
                }
              </div>
            </section>
          </div>
        </section>
      }
    </div>
  `,
})
export class RoomDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly roomService = inject(RoomService);

  readonly vm$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((roomId) =>
      combineLatest({
        room: this.roomService.getRoom(roomId),
        reviews: this.roomService.roomReviews(roomId),
      }),
    ),
  );

  imageLoaded = false;

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    this.imageLoaded = false;
  }
}
