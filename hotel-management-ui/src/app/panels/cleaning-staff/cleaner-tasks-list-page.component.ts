import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { HousekeepingService } from '../../core/services/housekeeping.service';

@Component({
  selector: 'app-cleaner-tasks-list-page',
  imports: [AsyncPipe, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-400 mx-auto">
      <section class="mb-8 lg:mb-12">
        <p
          class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Housekeeping
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          My Tasks
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Review assigned work items and move them through the cleaning workflow.
        </p>
      </section>

      @if (message()) {
        <div
          class="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fade-in"
        >
          <div
            class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"
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
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <p class="text-xs font-medium text-emerald-800 m-0">{{ message() }}</p>
        </div>
      }
      @if (error()) {
        <div
          class="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in"
        >
          <div
            class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p class="text-xs font-medium text-red-800 m-0">{{ error() }}</p>
        </div>
      }

      <div
        class="surface bg-white/80 backdrop-blur-xl rounded-4xl border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
      >
        <div
          class="p-6 border-b border-black/5 bg-neutral-50/50 flex items-center justify-between gap-4"
        >
          <h2 class="text-lg font-bold text-neutral-900 m-0">Assigned Task Records</h2>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              [class.bg-amber-700]="statusFilter() === 'all'"
              [class.text-white]="statusFilter() === 'all'"
              [class.bg-neutral-100]="statusFilter() !== 'all'"
              [class.text-neutral-600]="statusFilter() !== 'all'"
              (click)="setFilter('all')"
            >
              All
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              [class.bg-amber-700]="statusFilter() === 'pending'"
              [class.text-white]="statusFilter() === 'pending'"
              [class.bg-neutral-100]="statusFilter() !== 'pending'"
              [class.text-neutral-600]="statusFilter() !== 'pending'"
              (click)="setFilter('pending')"
            >
              Pending
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              [class.bg-amber-700]="statusFilter() === 'in_progress'"
              [class.text-white]="statusFilter() === 'in_progress'"
              [class.bg-neutral-100]="statusFilter() !== 'in_progress'"
              [class.text-neutral-600]="statusFilter() !== 'in_progress'"
              (click)="setFilter('in_progress')"
            >
              In Progress
            </button>
          </div>
        </div>

        <div class="overflow-x-auto flex-1 p-2">
          @if (tasks$ | async; as tasks) {
            <table class="w-full text-left border-collapse min-w-225">
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
                    Scheduled
                  </th>
                  <th
                    class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                  >
                    Priority
                  </th>
                  <th
                    class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                  >
                    Status
                  </th>
                  <th
                    class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                  >
                    Notes
                  </th>
                  <th
                    class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/5 align-middle">
                @for (task of tasks; track task.id) {
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-4 px-6 text-sm font-semibold text-neutral-900">
                      Room {{ task.room?.roomNumber || 'TBD' }}
                    </td>
                    <td class="py-4 px-6 text-sm text-neutral-600">
                      {{ task.scheduledFor | date: 'short' }}
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-neutral-700"
                      >
                        {{ task.priority }}
                      </span>
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border border-black/5"
                        [class.text-neutral-600]="task.status === 'pending'"
                        [class.bg-neutral-50]="task.status === 'pending'"
                        [class.text-amber-700]="task.status === 'in_progress'"
                        [class.bg-amber-50]="task.status === 'in_progress'"
                        [class.text-emerald-700]="task.status === 'completed'"
                        [class.bg-emerald-50]="task.status === 'completed'"
                      >
                        {{ task.status.replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-sm text-neutral-600 truncate max-w-65">
                      {{ task.notes || 'No notes' }}
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex items-center justify-end gap-2">
                        @if (task.status === 'pending') {
                          <button
                            type="button"
                            class="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            (click)="updateStatus(task.id, 'in_progress')"
                          >
                            Start
                          </button>
                        }
                        @if (task.status === 'in_progress') {
                          <button
                            type="button"
                            class="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            (click)="updateStatus(task.id, 'completed')"
                          >
                            Complete
                          </button>
                        }
                        <a
                          [routerLink]="['/cleaning-staff/tasks', task.id]"
                          class="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                          >Details</a
                        >
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-16 text-center text-neutral-500">
                      No tasks found for the selected filter.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `,
})
export class CleanerTasksListPageComponent {
  private readonly housekeepingService = inject(HousekeepingService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly message = signal('');
  readonly error = signal('');
  readonly statusFilter = signal<'all' | 'pending' | 'in_progress'>('all');

  readonly tasks$ = this.refresh$.pipe(
    switchMap(() => this.housekeepingService.listTasks()),
    map((tasks) =>
      tasks.filter((task) => {
        const filter = this.statusFilter();
        if (filter === 'all') {
          return true;
        }

        return task.status === filter;
      }),
    ),
  );

  async updateStatus(id: string, status: 'in_progress' | 'completed'): Promise<void> {
    this.message.set('');
    this.error.set('');

    try {
      await firstValueFrom(this.housekeepingService.updateStatus(id, { status }));
      this.message.set(`Task moved to ${status.replace('_', ' ')}.`);
      this.refresh$.next();
    } catch {
      this.error.set('Unable to update task status.');
    }
  }

  setFilter(status: 'all' | 'pending' | 'in_progress'): void {
    this.statusFilter.set(status);
    this.refresh$.next();
  }
}
