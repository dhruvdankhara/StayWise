import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';

import { HousekeepingService } from '../../core/services/housekeeping.service';

@Component({
  selector: 'app-manager-housekeeping-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-[1600px] mx-auto pb-12">
      <!-- Header -->
      <section class="mb-8 lg:mb-12">
        <p
          class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Operations
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Housekeeping Oversight
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Assign, reprioritize, and log maintenance and daily room cleaning tasks seamlessly.
        </p>
      </section>

      <!-- Main Action Grid -->
      <div class="grid grid-cols-1 gap-8 ">
        <!-- Form Side -->
        <div class="lg:col-span-4 lg:sticky lg:top-8">
          <form
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-8 relative overflow-hidden"
            [formGroup]="form"
            (ngSubmit)="save()"
          >
            <div
              class="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"
            ></div>

            <div class="flex items-center gap-3 mb-8 relative z-10">
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-neutral-900 m-0">
                {{ editingId() ? 'Update Schedule' : 'Log New Task' }}
              </h2>
            </div>

            <div class="flex flex-col gap-5 relative z-10">
              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Room Reference</span
                  >
                  <input
                    type="text"
                    formControlName="roomId"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none font-medium font-mono"
                  />
                </label>
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Assign To (UID)</span
                  >
                  <input
                    type="text"
                    formControlName="assignedTo"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  />
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Priority Level</span
                  >
                  <select
                    formControlName="priority"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Standard Routine</option>
                    <option value="high">High Target</option>
                    <option value="urgent">Urgent / Express</option>
                  </select>
                </label>
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Expected Slot</span
                  >
                  <input
                    type="datetime-local"
                    formControlName="scheduledFor"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  />
                </label>
              </div>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Additional Instructions</span
                >
                <textarea
                  formControlName="notes"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none resize-none"
                ></textarea>
              </label>
            </div>

            @if (message()) {
              <div
                class="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fade-in relative z-10"
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
                class="mt-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in relative z-10"
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

            <div class="mt-8 pt-6 border-t border-black/5 flex flex-col gap-3 relative z-10">
              <button
                type="submit"
                class="button w-full justify-center py-2.5 text-sm bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5"
              >
                {{ editingId() ? 'Save Updated Schedule' : 'Dispatch Assignment' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Table Side -->
        <div class="lg:col-span-8">
          <div
            class="surface bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
          >
            <div
              class="p-6 border-b border-black/5 bg-neutral-50/50 flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-white text-neutral-600 flex items-center justify-center border border-black/5 shadow-sm"
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <path d="M8 14h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 18h.01"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M16 18h.01"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-bold text-neutral-900 m-0">Task Ledger</h2>
              </div>
            </div>

            <div class="overflow-x-auto flex-1 p-2">
              @if (tasks$ | async; as tasks) {
                <table class="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Subject
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Significance
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Progress
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                      >
                        Adjust
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5 align-middle">
                    @for (task of tasks; track task.id) {
                      <tr class="hover:bg-amber-50/30 transition-colors group">
                        <td class="py-4 px-6">
                          <div class="flex items-center gap-3">
                            <div
                              class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 border border-black/5 shrink-0"
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
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                              </svg>
                            </div>
                            <strong class="block text-sm font-bold text-neutral-900 font-mono">{{
                              task.room?.roomNumber || 'Unknown'
                            }}</strong>
                          </div>
                        </td>
                        <td class="py-4 px-6">
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full"
                            [class.text-amber-700]="task.priority === 'high'"
                            [class.bg-amber-50]="task.priority === 'high'"
                            [class.text-red-700]="task.priority === 'urgent'"
                            [class.bg-red-50]="task.priority === 'urgent'"
                            [class.text-blue-700]="task.priority === 'normal'"
                            [class.bg-blue-50]="task.priority === 'normal'"
                            [class.text-neutral-500]="task.priority === 'low'"
                            [class.bg-neutral-100]="task.priority === 'low'"
                          >
                            <span
                              class="w-1.5 h-1.5 rounded-full"
                              [class.bg-amber-500]="task.priority === 'high'"
                              [class.bg-red-500]="task.priority === 'urgent'"
                              [class.bg-blue-500]="task.priority === 'normal'"
                              [class.bg-neutral-400]="task.priority === 'low'"
                            ></span>
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
                        <td class="py-4 px-6">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              class="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-600 transition-colors"
                              (click)="edit(task.id)"
                              title="Edit Ticket"
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
                                <path
                                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                ></path>
                                <path
                                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="4" class="py-16 text-center text-neutral-500">
                          Your task load is empty.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ManagerHousekeepingPageComponent {
  private readonly housekeepingService = inject(HousekeepingService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly editingId = signal<string | null>(null);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    roomId: ['', Validators.required],
    assignedTo: ['', Validators.required],
    priority: ['normal', Validators.required],
    scheduledFor: ['', Validators.required],
    notes: [''],
  });
  readonly tasks$ = this.refresh$.pipe(switchMap(() => this.housekeepingService.listTasks()));

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');
    const payload = {
      ...this.form.getRawValue(),
      scheduledFor: new Date(this.form.getRawValue().scheduledFor).toISOString(),
    };

    try {
      if (this.editingId()) {
        await firstValueFrom(this.housekeepingService.updateTask(this.editingId()!, payload));
        this.message.set('Task updated.');
      } else {
        await firstValueFrom(this.housekeepingService.createTask(payload));
        this.message.set('Task created.');
      }
      this.refresh$.next();
    } catch {
      this.error.set('Unable to save the task.');
    }
  }

  async edit(id: string): Promise<void> {
    const tasks = await firstValueFrom(this.housekeepingService.listTasks());
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      return;
    }
    this.editingId.set(id);
    this.form.patchValue({
      roomId: task.room?.id ?? '',
      assignedTo: task.assignedTo?.id ?? '',
      priority: task.priority,
      scheduledFor: task.scheduledFor.slice(0, 16),
      notes: task.notes ?? '',
    });
  }
}
