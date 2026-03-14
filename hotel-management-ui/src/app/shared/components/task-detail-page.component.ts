import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom, map, switchMap, tap } from 'rxjs';

import { HousekeepingService } from '../../core/services/housekeeping.service';

@Component({
  selector: 'app-task-detail-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (task$ | async; as task) {
      <section class="section">
        <article class="surface section-panel">
          <p class="eyebrow">Task detail</p>
          <h1>Room {{ task.room?.roomNumber || 'TBD' }}</h1>
          <p>{{ task.notes || 'No notes available.' }}</p>
          <form class="auth-form" [formGroup]="notesForm">
            <label><span>Task notes</span><input type="text" formControlName="notes" /></label>
          </form>
          <div class="button-row">
            <button type="button" class="button" (click)="update(task.id, 'in_progress')">Start task</button>
            <button type="button" class="button" (click)="update(task.id, 'completed')">Complete task</button>
            <button type="button" class="button button--ghost" (click)="update(task.id, 'skipped')">Skip</button>
          </div>
          @if (message()) { <p>{{ message() }}</p> }
          @if (error()) { <p class="error-text">{{ error() }}</p> }
        </article>
      </section>
    }
  `
})
export class TaskDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly housekeepingService = inject(HousekeepingService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly message = signal('');
  readonly error = signal('');
  readonly notesForm = this.formBuilder.nonNullable.group({
    notes: ['']
  });

  readonly task$ = this.refresh$.pipe(
    switchMap(() =>
      this.route.paramMap.pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((id) =>
          this.housekeepingService.listTasks().pipe(
            map((tasks) => tasks.find((task) => task.id === id) ?? null),
            tap((task) => this.notesForm.patchValue({ notes: task?.notes ?? '' }))
          )
        )
      )
    )
  );

  async update(id: string, status: string): Promise<void> {
    try {
      await firstValueFrom(
        this.housekeepingService.updateStatus(id, {
          status,
          notes: this.notesForm.getRawValue().notes
        })
      );
      this.message.set(`Task moved to ${status}.`);
      this.refresh$.next();
    } catch {
      this.error.set('Unable to update the task.');
    }
  }
}
