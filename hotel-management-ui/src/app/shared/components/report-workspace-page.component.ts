import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map, of, switchMap } from 'rxjs';

import { ReportService } from '../../core/services/report.service';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-report-workspace-page',
  imports: [AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ vm.eyebrow }}</p>
            <h1>{{ vm.title }}</h1>
            <p>{{ vm.description }}</p>
          </div>
          <div class="button-row">
            <button type="button" class="button button--ghost" (click)="download('/reports/occupancy', 'pdf')">Occupancy PDF</button>
            <button type="button" class="button button--ghost" (click)="download('/reports/revenue', 'xlsx')">Revenue XLSX</button>
            @if (vm.adminOnly) {
              <button type="button" class="button button--ghost" (click)="download('/reports/staff', 'pdf')">Staff PDF</button>
              <button type="button" class="button button--ghost" (click)="download('/reports/guests', 'xlsx')">Guest XLSX</button>
            }
          </div>
        </div>
        <div class="section-grid">
          <article class="surface section-panel">
            <p class="eyebrow">Occupancy</p>
            <pre>{{ vm.occupancy | json }}</pre>
          </article>
          <article class="surface section-panel">
            <p class="eyebrow">Revenue</p>
            <pre>{{ vm.revenue | json }}</pre>
          </article>
        </div>
        @if (vm.staff) {
          <div class="section-grid">
            <article class="surface section-panel">
              <p class="eyebrow">Staff performance</p>
              <pre>{{ vm.staff | json }}</pre>
            </article>
            <article class="surface section-panel">
              <p class="eyebrow">Guest analytics</p>
              <pre>{{ vm.guests | json }}</pre>
            </article>
          </div>
        }
        @if (vm.reviews.length) {
          <section class="section">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Review moderation</p>
                <h2>Visible review toggles</h2>
              </div>
            </div>
            <div class="card-grid">
              @for (review of vm.reviews; track review.id) {
                <article class="surface review-card">
                  <p class="pill">{{ review.rating }}/5</p>
                  <h3>{{ review.guest?.name || 'Guest review' }}</h3>
                  <p>{{ review.comment || 'No written comment.' }}</p>
                  <button type="button" class="button button--ghost" (click)="toggleReview(review.id, !review.isVisible)">
                    {{ review.isVisible ? 'Hide' : 'Show' }} review
                  </button>
                </article>
              }
            </div>
          </section>
        }
      </section>
    }
  `
})
export class ReportWorkspacePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly reportService = inject(ReportService);
  private readonly reviewService = inject(ReviewService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly vm$ = this.refresh$.pipe(
    switchMap(() =>
      combineLatest({
        occupancy: this.reportService.occupancyReport(),
        revenue: this.reportService.revenueReport(),
        staff: this.route.snapshot.data['adminOnly'] ? this.reportService.staffReport() : of(null),
        guests: this.route.snapshot.data['adminOnly'] ? this.reportService.guestReport() : of(null),
        reviews: this.route.snapshot.data['adminOnly'] ? this.reviewService.listAll() : of([])
      })
    ),
    map((data) => ({
      eyebrow: String(this.route.snapshot.data['eyebrow'] ?? 'Analytics'),
      title: String(this.route.snapshot.data['title'] ?? 'Reports'),
      description: String(this.route.snapshot.data['description'] ?? 'Operational and commercial reporting.'),
      adminOnly: Boolean(this.route.snapshot.data['adminOnly']),
      ...data
    }))
  );

  async download(
    path: '/reports/occupancy' | '/reports/revenue' | '/reports/staff' | '/reports/guests',
    format: 'pdf' | 'xlsx'
  ): Promise<void> {
    const blob = await firstValueFrom(this.reportService.downloadReport(path, format));
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async toggleReview(id: string, isVisible: boolean): Promise<void> {
    await firstValueFrom(this.reviewService.updateVisibility(id, isVisible));
    this.refresh$.next();
  }
}
