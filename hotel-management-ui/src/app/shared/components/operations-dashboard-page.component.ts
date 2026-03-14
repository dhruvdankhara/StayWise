import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';
import { HousekeepingService } from '../../core/services/housekeeping.service';
import { RoomService } from '../../core/services/room.service';
import { MetricCardComponent } from './metric-card.component';

@Component({
  selector: 'app-operations-dashboard-page',
  imports: [AsyncPipe, CurrencyPipe, MetricCardComponent],
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
        </div>
        <div class="card-grid card-grid--three">
          @for (metric of vm.metrics; track metric.label) {
            <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.hint" />
          }
        </div>
        <div class="section-grid">
          <article class="surface section-panel">
            <p class="eyebrow">Recent bookings</p>
            <div class="table-shell">
              <table>
                <thead><tr><th>Reference</th><th>Room</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  @for (booking of vm.bookings.slice(0, 5); track booking.id) {
                    <tr>
                      <td>{{ booking.bookingRef }}</td>
                      <td>{{ booking.room?.type || 'Room' }}</td>
                      <td><span class="pill">{{ booking.status }}</span></td>
                      <td>{{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </article>
          <article class="surface section-panel">
            <p class="eyebrow">Open housekeeping</p>
            <div class="stack-list">
              @for (task of vm.tasks.slice(0, 5); track task.id) {
                <div>
                  <strong>Room {{ task.room?.roomNumber || 'TBD' }} · {{ task.priority }}</strong>
                  <span>{{ task.status }} · {{ task.notes || 'No notes' }}</span>
                </div>
              } @empty {
                <div><strong>No active tasks</strong><span>Housekeeping queue is clear.</span></div>
              }
            </div>
          </article>
        </div>
      </section>
    }
  `
})
export class OperationsDashboardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);
  private readonly roomService = inject(RoomService);
  private readonly housekeepingService = inject(HousekeepingService);

  readonly vm$ = combineLatest({
    bookings: this.bookingService.listBookings().pipe(map((result) => result.items)),
    rooms: this.roomService.listRooms({ limit: 20 }),
    tasks: this.housekeepingService.listTasks()
  }).pipe(
    map(({ bookings, rooms, tasks }) => {
      const config = this.route.snapshot.data as {
        eyebrow: string;
        title: string;
        description: string;
      };
      return {
        ...config,
        bookings,
        tasks,
        metrics: [
          { label: 'Bookings', value: String(bookings.length), hint: 'Visible for this role' },
          { label: 'Rooms', value: String(rooms.length), hint: 'Active inventory loaded' },
          {
            label: 'Open tasks',
            value: String(tasks.filter((task) => task.status !== 'completed').length),
            hint: 'Housekeeping items not yet finished'
          }
        ]
      };
    })
  );
}
