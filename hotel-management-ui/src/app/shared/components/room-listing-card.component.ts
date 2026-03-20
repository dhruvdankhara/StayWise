import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { RoomListItem } from '../../core/models/app.models';

@Component({
  selector: 'app-room-listing-card',
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="surface listing-card group flex flex-col h-full bg-white/40 border border-white/50 rounded-4xl overflow-hidden hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0! text-left"
    >
      <div
        class="relative h-48 sm:h-56 w-full bg-neutral-100 overflow-hidden border-b border-black/5"
      >
        @if (room().images && room().images.length > 0) {
          <img
            [src]="room().images[0]"
            alt="{{ room().type }}"
            class="object-cover w-full h-full"
          />
        } @else {
          <div
            class="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-300"
          >
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
          </div>
        }

        <div class="absolute top-4 left-4">
          <span
            class="pill inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider rounded-full shadow-sm"
            [class.text-emerald-700]="isAvailable(room().status)"
            [class.text-amber-700]="!isAvailable(room().status)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              [class.bg-emerald-500]="isAvailable(room().status)"
              [class.bg-amber-500]="!isAvailable(room().status)"
            ></span>
            {{ statusLabel(room().status) }}
          </span>
        </div>
      </div>

      <div class="p-6 flex-1 flex flex-col">
        <h3
          class="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-amber-800 transition-colors uppercase tracking-tight"
        >
          {{ room().type }}
        </h3>
        <p class="text-neutral-600 text-sm line-clamp-2 mb-5">
          {{ room().description || descriptionFallback() }}
        </p>

        <div
          class="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 text-sm text-neutral-600 bg-black/5 p-4 rounded-2xl"
        >
          <div class="flex items-center gap-2">Room {{ room().roomNumber }}</div>
          <div class="flex items-center gap-2">Floor {{ room().floor }}</div>
          <div class="flex items-center gap-2 col-span-2">{{ room().capacity }} guest capacity</div>
        </div>

        @if (room().amenities.length > 0) {
          <div class="flex flex-wrap gap-2 mb-6">
            @for (feature of room().amenities; track feature) {
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-xs font-medium text-amber-900 border border-amber-100"
              >
                {{ feature }}
              </span>
            }
          </div>
        }

        <div class="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
          <strong class="text-2xl text-neutral-900"
            >{{ room().baseRate | currency: 'INR' : 'symbol' : '1.0-0'
            }}<span class="text-sm font-normal text-neutral-500">/night</span></strong
          >
          <a
            [routerLink]="['/rooms', room().id]"
            class="button shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200"
          >
            Details
          </a>
        </div>
      </div>
    </article>
  `,
})
export class RoomListingCardComponent {
  readonly room = input.required<RoomListItem>();
  readonly descriptionFallback = input('Live inventory from the StayWise property backend.');

  isAvailable(status: string): boolean {
    return status.toLowerCase() === 'available';
  }

  statusLabel(status: string): string {
    return status.replaceAll('_', ' ');
  }
}
