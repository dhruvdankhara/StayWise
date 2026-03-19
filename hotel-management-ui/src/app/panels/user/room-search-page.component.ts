import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import type { RoomListItem } from '../../core/models/app.models';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-room-search-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in pb-20 pt-12 text-left">
      <section class="container relative">
        <div class="max-w-3xl mb-10">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-4"
          >
            <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
            <p class="eyebrow !m-0 !text-xs text-amber-800">Room Search</p>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
            Find your perfect stay.
          </h1>
          <p class="mt-4 text-lg text-neutral-600">
            Search live room availability by date, room type, and guest count.
          </p>
        </div>

        <form
          class="surface relative z-10 border border-white/60 shadow-xl rounded-3xl p-6 lg:p-8 backdrop-blur-xl bg-white/70 mb-12 flex flex-col md:flex-row gap-4 lg:gap-6 items-end"
          [formGroup]="form"
          (ngSubmit)="search()"
        >
          <label class="flex-1 w-full flex flex-col gap-2">
            <span class="text-sm font-semibold text-neutral-700">Guests</span>
            <input
              type="number"
              min="1"
              formControlName="guests"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-shadow"
            />
          </label>
          <label class="flex-1 w-full flex flex-col gap-2">
            <span class="text-sm font-semibold text-neutral-700">Room type</span>
            <select
              formControlName="type"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-shadow appearance-none"
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="deluxe">Deluxe</option>
              <option value="family">Family</option>
            </select>
          </label>
          <label class="flex-[1.5] w-full flex flex-col gap-2">
            <span class="text-sm font-semibold text-neutral-700">Check-in</span>
            <input
              type="datetime-local"
              formControlName="checkIn"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-shadow"
            />
          </label>
          <label class="flex-[1.5] w-full flex flex-col gap-2">
            <span class="text-sm font-semibold text-neutral-700">Check-out</span>
            <input
              type="datetime-local"
              formControlName="checkOut"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-shadow"
            />
          </label>
          <button
            type="submit"
            class="button w-full md:w-auto shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200 whitespace-nowrap px-8 py-3.5 flex items-center justify-center"
          >
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
              class="mr-2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search
          </button>
        </form>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (room of rooms(); track room.id) {
            <article
              class="surface listing-card group flex flex-col h-full bg-white/40 border border-white/50 rounded-[2rem] overflow-hidden hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 !p-0 text-left"
            >
              <div
                class="relative h-48 sm:h-56 w-full bg-neutral-100 overflow-hidden border-b border-black/5"
              >
                <div
                  class="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-300"
                >
                  @if (room.images && room.images.length > 0) {
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
                      [src]="room.images[0]"
                      alt="{{ room.type }}"
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
                  class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-amber-800 transition-colors uppercase tracking-tight"
                >
                  {{ room.type }}
                </h3>
                <p class="text-neutral-600 text-sm line-clamp-2 mb-6 flex-1">
                  {{ room.description || 'Live inventory from the StayWise property backend.' }}
                </p>

                <div class="flex flex-wrap gap-2 mb-8">
                  @for (amenity of room.amenities; track amenity) {
                    <span
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-black/5 text-xs font-medium text-neutral-700 border border-black/5"
                    >
                      {{ amenity }}
                    </span>
                  }
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                  <strong class="text-2xl text-neutral-900"
                    >{{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0'
                    }}<span class="text-sm font-normal text-neutral-500">/night</span></strong
                  >
                  <a
                      [routerLink]="['/rooms', room.id]"
                      class="button shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200"
                    >
                      Details
                    </a>
                </div>
              </div>
            </article>
          } @empty {
            <article
              class="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center surface border border-white/50 rounded-[2rem] bg-white/40"
            >
              <div
                class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">No rooms found</h3>
              <p class="text-neutral-600 max-w-sm">
                We couldn't find any rooms matching your current search criteria. Try adjusting the
                filters or picking a different date range.
              </p>
            </article>
          }
        </div>
      </section>
    </div>
  `,
})
export class RoomSearchPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  readonly rooms = signal<RoomListItem[]>([]);
  readonly form = this.formBuilder.nonNullable.group({
    guests: 1,
    type: '',
    checkIn: '',
    checkOut: '',
  });

  constructor() {
    void this.loadDefaultRooms();
  }

  async search(): Promise<void> {
    const { checkIn, checkOut, guests, type } = this.form.getRawValue();

    if (!checkIn || !checkOut) {
      await this.loadDefaultRooms();
      return;
    }

    const rooms = await firstValueFrom(
      this.roomService.searchAvailable({
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
        type: type || undefined,
      }),
    );
    this.rooms.set(rooms);
  }

  private async loadDefaultRooms(): Promise<void> {
    const rooms = await firstValueFrom(this.roomService.listRooms({ limit: 12 }));
    this.rooms.set(rooms);
  }

  imageLoaded = false;

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    this.imageLoaded = false;
  }
}
