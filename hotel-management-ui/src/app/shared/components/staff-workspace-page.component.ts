import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';

import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-staff-workspace-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Staff management</p>
          <h1>Create, update, and deactivate staff accounts.</h1>
        </div>
      </div>
      <div class="section-grid">
        <form class="surface auth-form" [formGroup]="form" (ngSubmit)="save()">
          <label><span>Name</span><input type="text" formControlName="name" /></label>
          <label><span>Email</span><input type="email" formControlName="email" /></label>
          <label><span>Phone</span><input type="tel" formControlName="phone" /></label>
          <label>
            <span>Role</span>
            <select formControlName="role">
              <option value="hotel_manager">Hotel Manager</option>
              <option value="receptionist">Receptionist</option>
              <option value="cleaning_staff">Cleaning Staff</option>
            </select>
          </label>
          <label><span>Password</span><input type="password" formControlName="password" /></label>
          @if (message()) { <p>{{ message() }}</p> }
          @if (error()) { <p class="error-text">{{ error() }}</p> }
          <button type="submit" class="button button--full">{{ editingId() ? 'Save changes' : 'Create staff account' }}</button>
        </form>
        <div class="surface table-shell">
          @if (staff$ | async; as staff) {
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
              <tbody>
                @for (member of staff; track member.id) {
                  <tr>
                    <td>{{ member.name }}</td>
                    <td>{{ member.email }}</td>
                    <td><span class="pill">{{ member.role }}</span></td>
                    <td>
                      <button type="button" class="button button--ghost" (click)="edit(member.id)">Edit</button>
                      <button type="button" class="button button--ghost" (click)="deactivate(member.id)">Deactivate</button>
                    </td>
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
export class StaffWorkspacePageComponent {
  private readonly staffService = inject(StaffService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly editingId = signal<string | null>(null);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    role: 'receptionist',
    password: ['Password@123', Validators.required]
  });
  readonly staff$ = this.refresh$.pipe(switchMap(() => this.staffService.listStaff()));

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');

    try {
      if (this.editingId()) {
        await firstValueFrom(this.staffService.updateStaff(this.editingId()!, this.form.getRawValue()));
        this.message.set('Staff account updated.');
      } else {
        await firstValueFrom(this.staffService.createStaff(this.form.getRawValue()));
        this.message.set('Staff account created.');
      }
      this.editingId.set(null);
      this.refresh$.next();
    } catch {
      this.error.set('Unable to save the staff account.');
    }
  }

  async edit(id: string): Promise<void> {
    const staff = await firstValueFrom(this.staffService.listStaff());
    const member = staff.find((item) => item.id === id);
    if (!member) {
      return;
    }
    this.editingId.set(id);
    this.form.patchValue({
      name: member.name,
      email: member.email,
      phone: member.phone ?? '',
      role: member.role
    });
  }

  async deactivate(id: string): Promise<void> {
    try {
      await firstValueFrom(this.staffService.deactivateStaff(id));
      this.message.set('Staff account deactivated.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to deactivate the staff account.');
    }
  }
}
