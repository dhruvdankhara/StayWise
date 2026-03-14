import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoRooms } from '../../core/data/demo-data';

@Component({
  selector: 'app-admin-rooms-page',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Room management</p>
          <h1>Inventory, rates, amenities, and operational status.</h1>
        </div>
      </div>
      <div class="card-grid card-grid--three">
        @for (room of rooms; track room.id) {
          <article class="surface listing-card">
            <p class="pill">{{ room.status }}</p>
            <h3>{{ room.type }} · {{ room.roomNumber }}</h3>
            <p>{{ room.description }}</p>
            <div class="listing-card__footer">
              <strong>{{ room.rate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              <span>Capacity {{ room.capacity }}</span>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class AdminRoomsPageComponent {
  protected readonly rooms = demoRooms;
}
