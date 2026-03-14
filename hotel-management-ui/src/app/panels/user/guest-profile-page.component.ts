import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-guest-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Guest profile</p>
          <h1>Preferences, identity details, and billing profile.</h1>
        </div>
      </div>
      <div class="surface section-panel form-grid">
        <div>
          <p class="eyebrow">Stay preferences</p>
          <h2>High floor, late check-in, vegetarian breakfast</h2>
          <p>Persist profile details to prefill future reservations and front-desk notes.</p>
        </div>
        <div>
          <p class="eyebrow">Payment methods</p>
          <h2>Tokenized cards and UPI handles</h2>
          <p>Structure in place for Razorpay-backed saved methods and invoice downloads.</p>
        </div>
      </div>
    </section>
  `
})
export class GuestProfilePageComponent {}
