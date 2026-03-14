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
    @if (vm$ | async; as vm) {
      <section class="section container">
        <div class="section-grid">
          <article class="surface section-panel">
            <p class="eyebrow">Room detail</p>
            <h1>{{ vm.room.type }}</h1>
            <p>{{ vm.room.description || 'Premium stay configuration with live availability and booking support.' }}</p>
            <ul class="meta-list">
              <li>Room {{ vm.room.roomNumber }}</li>
              <li>Floor {{ vm.room.floor }}</li>
              <li>{{ vm.room.capacity }} guest capacity</li>
              <li>Status: {{ vm.room.status }}</li>
            </ul>
            <div class="listing-card__footer">
              <strong>{{ vm.room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              <a [routerLink]="['/booking', vm.room.id]" class="button">Reserve this room</a>
            </div>
          </article>
          <article class="surface section-panel">
            <p class="eyebrow">Amenities</p>
            <div class="stack-list">
              @for (amenity of vm.room.amenities; track amenity) {
                <div><strong>{{ amenity }}</strong><span>Included with this stay.</span></div>
              }
            </div>
          </article>
        </div>
        <section class="section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Visible reviews</p>
              <h2>Guest feedback for this room type.</h2>
            </div>
          </div>
          <div class="card-grid">
            @for (review of vm.reviews; track review.id) {
              <article class="surface review-card">
                <p class="pill">{{ review.rating }}/5</p>
                <h3>{{ review.guest?.name || 'Guest review' }}</h3>
                <p>{{ review.comment || 'No written comment.' }}</p>
              </article>
            } @empty {
              <article class="surface review-card"><h3>No reviews yet</h3><p>This room has no visible reviews.</p></article>
            }
          </div>
        </section>
      </section>
    }
  `
})
export class RoomDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly roomService = inject(RoomService);

  readonly vm$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((roomId) =>
      combineLatest({
        room: this.roomService.getRoom(roomId),
        reviews: this.roomService.roomReviews(roomId)
      })
    )
  );
}
