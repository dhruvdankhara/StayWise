import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoReviews } from '../../core/data/demo-data';

@Component({
  selector: 'app-guest-reviews-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Reviews and feedback</p>
          <h1>Post-checkout review flow with visible guest sentiment.</h1>
        </div>
      </div>
      <div class="card-grid">
        @for (review of reviews; track review.id) {
          <article class="surface review-card">
            <p class="pill">{{ review.rating }}/5 stars</p>
            <h3>{{ review.roomType }}</h3>
            <p>{{ review.comment }}</p>
            <strong>{{ review.guestName }}</strong>
          </article>
        }
      </div>
    </section>
  `
})
export class GuestReviewsPageComponent {
  protected readonly reviews = demoReviews;
}
