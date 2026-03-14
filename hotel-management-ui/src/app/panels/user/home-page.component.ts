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
      <section class="hero container">
        <div>
          <p class="eyebrow">Luxury hospitality, unified operations</p>
          <h1>{{ vm.settings.name }} powers booking, reception, housekeeping, and reporting from one system.</h1>
          <p class="lede">
            Guests browse rooms and manage stays, while staff handle check-in, billing, housekeeping, and analytics through role-based panels.
          </p>
          <div class="button-row">
            <a routerLink="/rooms" class="button">Explore rooms</a>
            <a routerLink="/auth/login" class="button button--ghost">Open your panel</a>
          </div>
        </div>
        <div class="hero-card surface">
          <p class="eyebrow">Hotel profile</p>
          <div class="stack-list">
            <div>
              <strong>{{ vm.settings.contactPhone }}</strong>
              <span>{{ vm.settings.address }}</span>
            </div>
            <div>
              <strong>Check-in {{ vm.settings.checkInTime }}</strong>
              <span>Check-out {{ vm.settings.checkOutTime }} · Tax {{ vm.settings.taxRate }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Available room inventory</p>
            <h2>Book directly into live availability.</h2>
          </div>
          <a routerLink="/rooms">View all rooms</a>
        </div>
        <div class="card-grid card-grid--three">
          @for (room of vm.rooms; track room.id) {
            <article class="surface listing-card">
              <p class="pill">{{ room.status }}</p>
              <h3>{{ room.type }}</h3>
              <p>{{ room.description || 'Thoughtfully prepared for premium comfort and efficient operations.' }}</p>
              <ul class="meta-list">
                <li>Room {{ room.roomNumber }}</li>
                <li>Floor {{ room.floor }}</li>
                <li>{{ room.capacity }} guest capacity</li>
              </ul>
              <div class="listing-card__footer">
                <strong>{{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
                <a [routerLink]="['/rooms', room.id]">Details</a>
              </div>
            </article>
          }
        </div>
      </section>
    }
  `
})
export class HomePageComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly roomService = inject(RoomService);

  readonly vm$ = combineLatest({
    settings: this.settingsService.getSettings(),
    rooms: this.roomService.listRooms({ limit: 3 })
  });
}
