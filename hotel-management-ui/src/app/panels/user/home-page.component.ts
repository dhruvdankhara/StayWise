import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { demoBookings, demoReviews, demoRooms } from '../../core/data/demo-data';

@Component({
  selector: 'app-home-page',
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero container">
      <div>
        <p class="eyebrow">Luxury hospitality, unified operations</p>
        <h1>StayWise brings your hotel’s guest journey and back-office workflows into one polished platform.</h1>
        <p class="lede">Move from room discovery to bookings, billing, housekeeping, reporting, and guest reviews without breaking context.</p>
        <div class="button-row">
          <a routerLink="/rooms" class="button">Explore rooms</a>
          <a routerLink="/auth/login" class="button button--ghost">Open a panel</a>
        </div>
      </div>
      <div class="hero-card surface">
        <p class="eyebrow">Live hotel snapshot</p>
        <div class="stack-list">
          <div>
            <strong>82% occupancy</strong>
            <span>18 arrivals, 11 departures, 94% housekeeping SLA</span>
          </div>
          <div>
            <strong>₹2.48L revenue today</strong>
            <span>Front desk, admin, manager, cleaning, and guest panels in one suite</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Room collection</p>
          <h2>Signature stays designed for business, leisure, and family bookings.</h2>
        </div>
        <a routerLink="/rooms">View all rooms</a>
      </div>
      <div class="card-grid card-grid--three">
        @for (room of rooms; track room.id) {
          <article class="surface listing-card">
            <p class="pill">{{ room.status }}</p>
            <h3>{{ room.type }}</h3>
            <p>{{ room.description }}</p>
            <ul class="meta-list">
              <li>Room {{ room.roomNumber }}</li>
              <li>Floor {{ room.floor }}</li>
              <li>{{ room.capacity }} guest capacity</li>
            </ul>
            <div class="listing-card__footer">
              <strong>{{ room.rate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              <a routerLink="/rooms">Reserve</a>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="section section--split container">
      <div class="surface section-panel">
        <p class="eyebrow">Booking activity</p>
        <h2>Reception-ready booking visibility.</h2>
        <div class="table-shell">
          <table>
            <thead>
              <tr><th>Reference</th><th>Guest</th><th>Room</th><th>Status</th></tr>
            </thead>
            <tbody>
              @for (booking of bookings; track booking.id) {
                <tr>
                  <td>{{ booking.ref }}</td>
                  <td>{{ booking.guestName }}</td>
                  <td>{{ booking.roomType }}</td>
                  <td><span class="pill">{{ booking.status }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      <div class="surface section-panel">
        <p class="eyebrow">Guest sentiment</p>
        <h2>Visible reviews post check-out.</h2>
        <div class="stack-list">
          @for (review of reviews; track review.id) {
            <div>
              <strong>{{ review.guestName }} · {{ review.rating }}/5</strong>
              <span>{{ review.comment }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent {
  protected readonly rooms = demoRooms;
  protected readonly bookings = demoBookings;
  protected readonly reviews = demoReviews;
}
