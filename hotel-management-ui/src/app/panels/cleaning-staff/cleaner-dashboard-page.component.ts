import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { HousekeepingService } from '../../core/services/housekeeping.service';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-cleaner-dashboard-page',
  imports: [AsyncPipe, DatePipe, MetricCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="animate-fade-in relative z-10 max-w-400 mx-auto">
        <section class="mb-10 lg:mb-14">
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
        </section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          @for (metric of vm.metrics; track metric.label) {
            <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.hint" />
          }
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          <article
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col h-full"
          >
            <div class="p-8 border-b border-black/5 flex items-center gap-4 bg-neutral-50/50">
              <div
                class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="min-w-0">
                <h2 class="text-xl font-bold text-neutral-900 m-0">Upcoming Tasks</h2>
                <p class="text-sm text-neutral-500 m-0">Prioritized by schedule time.</p>
              </div>
            </div>

            <div class="overflow-x-auto flex-1 p-2">
              <table class="w-full text-left border-collapse min-w-125">
                <thead>
                  <tr>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Room
                    </th>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Slot
                    </th>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Status
                    </th>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/5 align-middle">
                  @for (task of vm.nextTasks; track task.id) {
                    <tr class="hover:bg-neutral-50/50 transition-colors">
                      <td class="py-4 px-6 text-sm font-semibold text-neutral-900">
                        Room {{ task.room?.roomNumber || 'TBD' }}
                      </td>
                      <td class="py-4 px-6 text-sm text-neutral-600 font-medium">
                        {{ task.scheduledFor | date: 'short' }}
                      </td>
                      <td class="py-4 px-6">
                        <span
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-neutral-600 border border-black/5"
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full"
                            [class.bg-neutral-400]="task.status === 'pending'"
                            [class.bg-amber-500]="task.status === 'in_progress'"
                            [class.bg-emerald-500]="task.status === 'completed'"
                          ></span>
                          {{ task.status.replace('_', ' ') }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-right">
                        <a
                          [routerLink]="['/cleaning-staff/tasks', task.id]"
                          class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          Open
                        </a>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td
                        colspan="4"
                        class="px-6 py-12 text-center text-sm text-neutral-500 font-medium border-0"
                      >
                        No pending or active tasks.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </article>

          <article
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col h-full"
          >
            <div class="p-8 border-b border-black/5 flex items-center gap-4 bg-orange-50/30">
              <div
                class="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center border border-black/5 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m2.5 13 4.5-4.5"></path>
                  <path d="m9.5 6 4.5-4.5"></path>
                  <path d="m11.5 8 4.5-4.5"></path>
                  <path d="M14.5 11 22 3.5"></path>
                  <path d="m6 16.5-4 4.5"></path>
                  <path d="m9 13.5-4 4.5"></path>
                  <path d="m12 10.5-4 4.5"></path>
                  <path d="m15 7.5-4 4.5"></path>
                  <path d="M19 19.5v-3.5a1.5 1.5 0 0 0-1.5-1.5H14a1.5 1.5 0 0 0-1.5 1.5v3.5"></path>
                  <path d="M14 17h3.5"></path>
                </svg>
              </div>
              <div class="min-w-0">
                <h2 class="text-xl font-bold text-neutral-900 m-0">Recently Completed</h2>
                <p class="text-sm text-neutral-500 m-0">Latest finished cleaning items.</p>
              </div>
            </div>

            <div class="p-4 sm:p-6 lg:p-8 flex-1">
              <div class="flex flex-col gap-4">
                @for (task of vm.recentCompleted; track task.id) {
                  <div
                    class="flex items-start gap-4 p-4 rounded-2xl border border-black/5 bg-white hover:border-black/10 transition-colors shadow-sm"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 font-bold text-sm"
                    >
                      {{ task.room?.roomNumber?.charAt(0) || 'R' }}
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start mb-1">
                        <strong class="text-sm font-bold text-neutral-900"
                          >Room {{ task.room?.roomNumber || 'TBD' }}</strong
                        >
                        <span
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-[10px] font-bold uppercase tracking-wider rounded-full text-emerald-700"
                        >
                          Completed
                        </span>
                      </div>
                      <div class="flex items-center gap-2 mt-2">
                        <span
                          class="text-xs font-semibold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded-md uppercase tracking-wide"
                          >{{ task.priority }}</span
                        >
                        <span class="text-xs text-neutral-500 truncate max-w-50">{{
                          task.completedAt
                            ? 'Done on ' + (task.completedAt | date: 'short')
                            : 'Completed'
                        }}</span>
                      </div>
                    </div>
                  </div>
                } @empty {
                  <div
                    class="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-neutral-50/50 border border-dashed border-black/10 text-center"
                  >
                    <div
                      class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <strong class="block text-neutral-900 font-bold mb-1">No active tasks</strong>
                    <span class="text-sm text-neutral-500">Complete tasks will appear here.</span>
                  </div>
                }
              </div>
            </div>
          </article>
        </div>
      </div>
    }
  `,
})
export class CleanerDashboardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly housekeepingService = inject(HousekeepingService);

  readonly vm$ = this.housekeepingService.listTasks().pipe(
    map((tasks) => {
      const config = this.route.snapshot.data as {
        eyebrow: string;
        title: string;
        description: string;
      };

      const now = new Date();
      const openTasks = tasks.filter((task) => task.status !== 'completed');
      const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');
      const completedTasks = tasks.filter((task) => task.status === 'completed');
      const dueToday = openTasks.filter((task) => {
        const scheduled = new Date(task.scheduledFor);
        return scheduled.toDateString() === now.toDateString();
      });

      const nextTasks = [...openTasks]
        .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
        .slice(0, 5);

      const recentCompleted = [...completedTasks]
        .sort(
          (a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime(),
        )
        .slice(0, 5);

      return {
        ...config,
        nextTasks,
        recentCompleted,
        metrics: [
          { label: 'Assigned tasks', value: String(tasks.length), hint: 'Tasks assigned to you' },
          { label: 'In progress', value: String(inProgressTasks.length), hint: 'Currently active' },
          {
            label: 'Due today',
            value: String(dueToday.length),
            hint: 'Open items scheduled for today',
          },
        ],
      };
    }),
  );
}
