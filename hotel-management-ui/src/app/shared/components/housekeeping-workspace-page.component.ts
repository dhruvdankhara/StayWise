import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';

import { HousekeepingService } from '../../core/services/housekeeping.service';

@Component({
  selector: 'app-housekeeping-workspace-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Housekeeping oversight</p>
          <h1>Assign, reprioritize, and reschedule room cleaning tasks.</h1>
        </div>
      </div>
      <div class="section-grid">
        <form class="surface auth-form" [formGroup]="form" (ngSubmit)="save()">
          <label><span>Room ID</span><input type="text" formControlName="roomId" /></label>
          <label><span>Assigned to</span><input type="text" formControlName="assignedTo" /></label>
          <label><span>Priority</span><input type="text" formControlName="priority" /></label>
          <label><span>Scheduled for</span><input type="datetime-local" formControlName="scheduledFor" /></label>
          <label><span>Notes</span><input type="text" formControlName="notes" /></label>
          @if (message()) { <p>{{ message() }}</p> }
          @if (error()) { <p class="error-text">{{ error() }}</p> }
          <button type="submit" class="button button--full">{{ editingId() ? 'Save task' : 'Create task' }}</button>
        </form>
        <div class="surface table-shell">
          @if (tasks$ | async; as tasks) {
            <table>
              <thead><tr><th>Room</th><th>Priority</th><th>Status</th><th></th></tr></thead>
              <tbody>
                @for (task of tasks; track task.id) {
                  <tr>
                    <td>{{ task.room?.roomNumber || 'Room' }}</td>
                    <td>{{ task.priority }}</td>
                    <td><span class="pill">{{ task.status }}</span></td>
                    <td><button type="button" class="button button--ghost" (click)="edit(task.id)">Edit</button></td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </section>
  `
})
export class HousekeepingWorkspacePageComponent {
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
    notes: ['']
  });
  readonly tasks$ = this.refresh$.pipe(switchMap(() => this.housekeepingService.listTasks()));

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');
    const payload = {
      ...this.form.getRawValue(),
      scheduledFor: new Date(this.form.getRawValue().scheduledFor).toISOString()
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
      notes: task.notes ?? ''
    });
  }
}
