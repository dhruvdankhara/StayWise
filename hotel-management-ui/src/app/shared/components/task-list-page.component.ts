import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HousekeepingService } from '../../core/services/housekeeping.service';

@Component({
  selector: 'app-task-list-page',
  imports: [AsyncPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Task list</p>
          <h1>Assigned housekeeping tasks.</h1>
        </div>
      </div>
      @if (tasks$ | async; as tasks) {
        <div class="card-grid">
          @for (task of tasks; track task.id) {
            <article class="surface review-card">
              <p class="pill">{{ task.status }}</p>
              <h3>Room {{ task.room?.roomNumber || 'TBD' }}</h3>
              <p>{{ task.notes || 'No notes' }}</p>
              <a [routerLink]="['/cleaning-staff/tasks', task.id]" class="button button--ghost">Open task</a>
            </article>
          }
        </div>
      }
    </section>
  `
})
export class TaskListPageComponent {
  private readonly housekeepingService = inject(HousekeepingService);
  readonly tasks$ = this.housekeepingService.listTasks();
}
