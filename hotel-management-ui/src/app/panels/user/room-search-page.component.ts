import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import type { RoomListItem } from '../../core/models/app.models';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-room-search-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Room search</p>
          <h1>Search live room availability by date, room type, and guest count.</h1>
        </div>
      </div>
      <form class="surface filter-bar" [formGroup]="form" (ngSubmit)="search()">
        <label>
          <span>Guests</span>
          <input type="number" min="1" formControlName="guests" />
        </label>
        <label>
          <span>Room type</span>
          <select formControlName="type">
            <option value="">All</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="deluxe">Deluxe</option>
            <option value="family">Family</option>
          </select>
        </label>
        <label>
          <span>Check-in</span>
          <input type="datetime-local" formControlName="checkIn" />
        </label>
        <label>
          <span>Check-out</span>
          <input type="datetime-local" formControlName="checkOut" />
        </label>
        <button type="submit" class="button">Search availability</button>
      </form>
      <div class="card-grid card-grid--three">
        @for (room of rooms(); track room.id) {
          <article class="surface listing-card">
            <p class="pill">{{ room.status }}</p>
            <h3>{{ room.type }}</h3>
            <p>{{ room.description || 'Live inventory from the StayWise property backend.' }}</p>
            <ul class="meta-list">
              @for (amenity of room.amenities; track amenity) {
                <li>{{ amenity }}</li>
              }
            </ul>
            <div class="listing-card__footer">
              <strong>{{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              <a [routerLink]="['/rooms', room.id]" class="button">View details</a>
            </div>
          </article>
        } @empty {
          <article class="surface review-card">
            <h3>No rooms found</h3>
            <p>Adjust the filters or search a different date range.</p>
          </article>
        }
      </div>
    </section>
  `
})
export class RoomSearchPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  readonly rooms = signal<RoomListItem[]>([]);
  readonly form = this.formBuilder.nonNullable.group({
    guests: 1,
    type: '',
    checkIn: '',
    checkOut: ''
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
        type: type || undefined
      })
    );
    this.rooms.set(rooms);
  }

  private async loadDefaultRooms(): Promise<void> {
    const rooms = await firstValueFrom(this.roomService.listRooms({ limit: 12 }));
    this.rooms.set(rooms);
  }
}
