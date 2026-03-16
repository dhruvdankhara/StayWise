import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, switchMap } from 'rxjs';

import { GuestItem, GuestService } from '../../core/services/guest.service';

@Component({
  selector: 'app-receptionist-guests-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Guest management</p>
        </div>
        <button
          class="button justify-center py-2.5 text-sm bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5"
          (click)="showForm = !showForm"
        >
          {{ showForm ? 'Cancel' : 'Add Guest' }}
        </button>
      </div>

      @if (showForm) {
        <div class="surface rounded-xl p-6 mb-8 text-slate-800">
          <h3 class="text-xl font-semibold mb-6">Add New Guest</h3>
          <form [formGroup]="guestForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label for="name" class="text-sm font-medium text-slate-600">Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="control rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-colors"
                placeholder="e.g. John Doe"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-sm font-medium text-slate-600">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="control rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="phone" class="text-sm font-medium text-slate-600">Phone Number</label>
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                class="control rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-colors"
                placeholder="+1234567890"
              />
            </div>
            <div class="pt-2">
              <button
                type="submit"
                [disabled]="guestForm.invalid || isSubmitting"
                class="button justify-center py-2.5 px-6 text-sm bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {{ isSubmitting ? 'Saving...' : 'Save Guest' }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (guests$ | async; as guests) {
        <div class="table-shell surface">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Latest booking</th>
              </tr>
            </thead>
            <tbody>
              @for (guest of guests; track guest._id) {
                <tr>
                  <td>{{ guest.name }}</td>
                  <td>{{ guest.email || 'N/A' }}</td>
                  <td>{{ guest.phone || 'N/A' }}</td>
                  <td>{{ guest.latestBooking }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class ReceptionistGuestsPageComponent {
  private readonly guestService = inject(GuestService);

  showForm = false;
  isSubmitting = false;

  guestForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly guests$ = this.refreshTrigger$.pipe(switchMap(() => this.guestService.listGuests()));

  onSubmit() {
    if (this.guestForm.invalid) return;

    this.isSubmitting = true;
    this.guestService.createGuest(this.guestForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showForm = false;
        this.guestForm.reset();
        this.refreshTrigger$.next();
      },
      error: (err) => {
        console.error('Error creating guest:', err);
        this.isSubmitting = false;
        alert('Failed to create guest. Check console or verify if email is already in use.');
      },
    });
  }
}
