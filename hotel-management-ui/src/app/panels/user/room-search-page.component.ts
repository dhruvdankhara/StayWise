import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { demoRooms } from '../../core/data/demo-data';

@Component({
  selector: 'app-room-search-page',
  imports: [CurrencyPipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Room search</p>
          <h1>Search by room type, guest count, and nightly budget.</h1>
        </div>
      </div>
      <div class="surface filter-bar">
        <label>
          <span>Guests</span>
          <input type="number" min="1" [(ngModel)]="guests" />
        </label>
        <label>
          <span>Room type</span>
          <select [(ngModel)]="type">
            <option value="">All</option>
            <option value="Single Retreat">Single Retreat</option>
            <option value="Deluxe Horizon">Deluxe Horizon</option>
            <option value="Signature Suite">Signature Suite</option>
          </select>
        </label>
        <label>
          <span>Max rate</span>
          <input type="number" min="1000" step="500" [(ngModel)]="maxRate" />
        </label>
      </div>
      <div class="card-grid card-grid--three">
        @for (room of filteredRooms; track room.id) {
          <article class="surface listing-card">
            <p class="pill">{{ room.status }}</p>
            <h3>{{ room.type }}</h3>
            <p>{{ room.description }}</p>
            <ul class="meta-list">
              @for (amenity of room.amenities; track amenity) {
                <li>{{ amenity }}</li>
              }
            </ul>
            <div class="listing-card__footer">
              <strong>{{ room.rate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              <button type="button" class="button">Book now</button>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class RoomSearchPageComponent {
  guests = 1;
  type = '';
  maxRate = 15000;

  get filteredRooms() {
    return demoRooms.filter(
      (room) => room.capacity >= this.guests && room.rate <= this.maxRate && (this.type ? room.type === this.type : true)
    );
  }
}
