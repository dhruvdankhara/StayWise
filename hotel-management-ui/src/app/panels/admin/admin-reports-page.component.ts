import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map, of, switchMap } from 'rxjs';

import { ReportService } from '../../core/services/report.service';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-admin-reports-page',
  imports: [AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="animate-fade-in relative z-10 max-w-[1600px] mx-auto pb-12">
        <!-- Header & Top Actions -->
        <section class="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              {{ vm.eyebrow }}
            </p>
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4"
            >
              {{ vm.title }}
            </h1>
            <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
              {{ vm.description }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <div
              class="flex flex-wrap gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-black/5 shadow-sm"
            >
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border border-black/5 rounded-xl text-sm font-semibold text-neutral-700 transition-all shadow-sm"
                (click)="download('/reports/occupancy', 'pdf')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  class="text-amber-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                Occupancy
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border border-black/5 rounded-xl text-sm font-semibold text-neutral-700 transition-all shadow-sm"
                (click)="download('/reports/revenue', 'xlsx')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  class="text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="8" y1="13" x2="16" y2="13"></line>
                  <line x1="8" y1="17" x2="16" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Revenue
              </button>
            </div>

            @if (vm.adminOnly) {
              <div
                class="flex flex-wrap gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-black/5 shadow-sm"
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border border-black/5 rounded-xl text-sm font-semibold text-neutral-700 transition-all shadow-sm"
                  (click)="download('/reports/staff', 'pdf')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    class="text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <circle cx="12" cy="13" r="2"></circle>
                    <path d="M12 15c-1.6 0-3 1.4-3 3"></path>
                  </svg>
                  Staff
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border border-black/5 rounded-xl text-sm font-semibold text-neutral-700 transition-all shadow-sm"
                  (click)="download('/reports/guests', 'xlsx')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    class="text-purple-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M16 19h2a2 2 0 0 0 2-2v-2"></path>
                    <path d="M20 11v-2a2 2 0 0 0-2-2h-2"></path>
                    <path d="M4 11v2"></path>
                    <path d="M4 19v-2"></path>
                  </svg>
                  Guests
                </button>
              </div>
            }
          </div>
        </section>

        <!-- Core Reports Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
          <div
            class="absolute inset-0 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"
          ></div>

          <article
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-8 relative z-10 flex flex-col h-full"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 3v18h18"></path>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-900 m-0">Occupancy Real-time Data</h3>
            </div>
            <div
              class="flex-1 bg-neutral-900 rounded-2xl p-4 overflow-x-auto border border-black/10 shadow-inner"
            >
              <pre class="text-xs text-emerald-400 font-mono m-0">{{ vm.occupancy | json }}</pre>
            </div>
          </article>

          <article
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-8 relative z-10 flex flex-col h-full"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-900/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-900 m-0">Revenue Metrics Stream</h3>
            </div>
            <div
              class="flex-1 bg-neutral-900 rounded-2xl p-4 overflow-x-auto border border-black/10 shadow-inner"
            >
              <pre class="text-xs text-amber-400 font-mono m-0">{{ vm.revenue | json }}</pre>
            </div>
          </article>
        </div>

        <!-- Admin Extended Reports Grid -->
        @if (vm.staff) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative">
            <article
              class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-8 relative z-10 flex flex-col h-full"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-900/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-neutral-900 m-0">Staff Performance Export</h3>
              </div>
              <div
                class="flex-1 bg-neutral-900 rounded-2xl p-4 overflow-x-auto border border-black/10 shadow-inner"
              >
                <pre class="text-xs text-blue-400 font-mono m-0">{{ vm.staff | json }}</pre>
              </div>
            </article>

            <article
              class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-8 relative z-10 flex flex-col h-full"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-900/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-neutral-900 m-0">Guest Segmentation Analytics</h3>
              </div>
              <div
                class="flex-1 bg-neutral-900 rounded-2xl p-4 overflow-x-auto border border-black/10 shadow-inner"
              >
                <pre class="text-xs text-purple-400 font-mono m-0">{{ vm.guests | json }}</pre>
              </div>
            </article>
          </div>
        }

        <!-- Review Moderation Section -->
        @if (vm.reviews.length) {
          <section class="mt-8 border-t border-black/5 pt-12">
            <div class="mb-8">
              <p
                class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                Moderation Queue
              </p>
              <h2 class="text-2xl font-bold text-neutral-900 m-0">Review Visibility Controls</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (review of vm.reviews; track review.id) {
                <article
                  class="surface bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm flex flex-col hover:border-amber-500/30 transition-colors group"
                >
                  <div class="flex items-center justify-between mb-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        ></polygon>
                      </svg>
                      {{ review.rating }} / 5
                    </span>

                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border"
                      [class.bg-emerald-50]="review.isVisible"
                      [class.text-emerald-700]="review.isVisible"
                      [class.border-emerald-100]="review.isVisible"
                      [class.bg-neutral-50]="!review.isVisible"
                      [class.text-neutral-500]="!review.isVisible"
                      [class.border-neutral-200]="!review.isVisible"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        [class.bg-emerald-500]="review.isVisible"
                        [class.bg-neutral-400]="!review.isVisible"
                      ></span>
                      {{ review.isVisible ? 'Public' : 'Hidden' }}
                    </span>
                  </div>

                  <h3
                    class="text-lg font-bold text-neutral-900 mb-2 truncate"
                    [title]="review.guest?.name || 'Guest review'"
                  >
                    {{ review.guest?.name || 'Anonymous Guest' }}
                  </h3>

                  <p
                    class="text-sm text-neutral-600 mb-6 flex-1 line-clamp-3 leading-relaxed italic"
                  >
                    "{{ review.comment || 'No written comment provided.' }}"
                  </p>

                  <button
                    type="button"
                    class="w-full justify-center py-2.5 text-sm font-semibold rounded-xl border transition-all flex items-center gap-2"
                    [class.bg-white]="review.isVisible"
                    [class.border-black/5]="review.isVisible"
                    [class.text-neutral-700]="review.isVisible"
                    [class.hover:bg-neutral-50]="review.isVisible"
                    [class.bg-amber-50]="!review.isVisible"
                    [class.border-amber-200]="!review.isVisible"
                    [class.text-amber-800]="!review.isVisible"
                    [class.hover:bg-amber-100]="!review.isVisible"
                    (click)="toggleReview(review.id, !review.isVisible)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      @if (review.isVisible) {
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                      } @else {
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      }
                    </svg>
                    {{ review.isVisible ? 'Hide from Public' : 'Make Public' }}
                  </button>
                </article>
              }
            </div>
          </section>
        }
      </div>
    }
  `,
})
export class AdminReportsPageComponent {
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
        reviews: this.route.snapshot.data['adminOnly'] ? this.reviewService.listAll() : of([]),
      }),
    ),
    map((data) => ({
      eyebrow: String(this.route.snapshot.data['eyebrow'] ?? 'Analytics'),
      title: String(this.route.snapshot.data['title'] ?? 'Reports'),
      description: String(
        this.route.snapshot.data['description'] ?? 'Operational and commercial reporting.',
      ),
      adminOnly: Boolean(this.route.snapshot.data['adminOnly']),
      ...data,
    })),
  );

  async download(
    path: '/reports/occupancy' | '/reports/revenue' | '/reports/staff' | '/reports/guests',
    format: 'pdf' | 'xlsx',
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
