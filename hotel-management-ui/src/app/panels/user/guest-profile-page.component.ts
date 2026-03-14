import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-guest-profile-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Guest profile</p>
          <h1>Personal details, preferences, and account identity.</h1>
        </div>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <label><span>Name</span><input type="text" formControlName="name" /></label>
        <label><span>Phone</span><input type="tel" formControlName="phone" /></label>
        <label><span>Profile image URL</span><input type="url" formControlName="profileImage" /></label>
        @if (message()) { <p>{{ message() }}</p> }
        @if (error()) { <p class="error-text">{{ error() }}</p> }
        <button type="submit" class="button button--full">Save profile</button>
      </form>
    </section>
  `
})
export class GuestProfilePageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    name: [this.authService.user()?.name ?? '', [Validators.required]],
    phone: [this.authService.user()?.phone ?? ''],
    profileImage: [this.authService.user()?.profileImage ?? '']
  });

  async submit(): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await this.authService.updateProfile(this.form.getRawValue());
      this.message.set('Profile updated successfully.');
    } catch {
      this.error.set('Unable to update the profile.');
    }
  }
}
