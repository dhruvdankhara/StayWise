import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map, switchMap, tap } from 'rxjs';

import { HousekeepingService } from '../../core/services/housekeeping.service';

@Component({
  selector: 'app-cleaner-task-detail-page',
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (task$ | async; as task) {
      <div class="animate-fade-in relative z-10 max-w-4xl mx-auto">
        <section class="mb-8 lg:mb-12">
          <a
            routerLink="/cleaning-staff/tasks"
            class="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors mb-4"
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Tasks
          </a>
          <p
            class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            Task Detail
          </p>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
            Room {{ task.room?.roomNumber || 'TBD' }}
          </h1>
          <p class="text-sm text-neutral-600 m-0">
            Scheduled for {{ task.scheduledFor | date: 'fullDate' }} at
            {{ task.scheduledFor | date: 'shortTime' }}
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

        <article
          class="surface bg-white/80 backdrop-blur-xl rounded-4xl border border-black/5 shadow-sm p-6 sm:p-8 relative overflow-hidden"
        >
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="p-4 rounded-xl bg-neutral-50 border border-black/5">
              <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Priority
              </p>
              <p class="text-sm font-semibold text-neutral-900 m-0">{{ task.priority }}</p>
            </div>
            <div class="p-4 rounded-xl bg-neutral-50 border border-black/5">
              <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Status
              </p>
              <p class="text-sm font-semibold text-neutral-900 m-0">
                {{ task.status.replace('_', ' ') }}
              </p>
            </div>
            <div class="p-4 rounded-xl bg-neutral-50 border border-black/5">
              <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Completed
              </p>
              <p class="text-sm font-semibold text-neutral-900 m-0">
                {{ task.completedAt ? (task.completedAt | date: 'short') : 'Not yet' }}
              </p>
            </div>
          </div>

          <form [formGroup]="notesForm" class="mb-6">
            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Task Notes</span
              >
              <textarea
                rows="3"
                formControlName="notes"
                class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none resize-none"
              ></textarea>
            </label>
          </form>

          <div class="flex flex-wrap items-center gap-3">
            @if (task.status === 'pending') {
              <button
                type="button"
                class="px-4 py-2 text-sm font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-xl transition-colors disabled:opacity-50"
                [disabled]="task.status !== 'pending'"
                (click)="update(task.id, 'in_progress')"
              >
                Start Task
              </button>
            }
            @if (task.status === 'in_progress') {
              <button
                type="button"
                class="px-4 py-2 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors disabled:opacity-50"
                (click)="update(task.id, 'completed')"
              >
                Complete Task
              </button>
            }
          </div>
        </article>
      </div>
    } @else {
      <div class="max-w-4xl mx-auto py-16 text-center text-neutral-500">Task not found.</div>
    }
  `,
})
export class CleanerTaskDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly housekeepingService = inject(HousekeepingService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly message = signal('');
  readonly error = signal('');
  readonly notesForm = this.formBuilder.nonNullable.group({
    notes: [''],
  });
  private readonly taskId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

  readonly task$ = combineLatest([this.refresh$, this.taskId$]).pipe(
    switchMap(([, id]) =>
      this.housekeepingService.listTasks().pipe(
        map((tasks) => tasks.find((task) => task.id === id) ?? null),
        tap((task) => this.notesForm.patchValue({ notes: task?.notes ?? '' })),
      ),
    ),
  );

  async update(id: string, status: string): Promise<void> {
    try {
      await firstValueFrom(
        this.housekeepingService.updateStatus(id, {
          status,
          notes: this.notesForm.getRawValue().notes,
        }),
      );
      this.message.set(`Task moved to ${status}.`);
      this.refresh$.next();
    } catch {
      this.error.set('Unable to update the task.');
    }
  }
}
