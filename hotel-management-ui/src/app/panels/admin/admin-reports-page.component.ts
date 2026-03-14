import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Reports and exports</p>
          <h1>Occupancy, revenue, guest, and staff performance reporting.</h1>
        </div>
      </div>
      <div class="card-grid card-grid--three">
        <article class="surface metric-card"><p class="eyebrow">Occupancy</p><h3>Daily and monthly mix</h3><p class="metric-card__change">PDF and XLSX export ready</p></article>
        <article class="surface metric-card"><p class="eyebrow">Revenue</p><h3>Room-type contribution</h3><p class="metric-card__change">Promotion and source analysis</p></article>
        <article class="surface metric-card"><p class="eyebrow">Guest analytics</p><h3>Repeat customer trends</h3><p class="metric-card__change">Average rating by room class</p></article>
      </div>
    </section>
  `
})
export class AdminReportsPageComponent {}
