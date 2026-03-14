import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings-workspace-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">System configuration</p>
          <h1>Hotel profile, tax settings, and invoice footer.</h1>
        </div>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="save()">
        <label><span>Hotel name</span><input type="text" formControlName="name" /></label>
        <label><span>Address</span><input type="text" formControlName="address" /></label>
        <label><span>Contact email</span><input type="email" formControlName="contactEmail" /></label>
        <label><span>Contact phone</span><input type="tel" formControlName="contactPhone" /></label>
        <label><span>Logo URL</span><input type="url" formControlName="logoUrl" /></label>
        <label><span>Invoice footer</span><input type="text" formControlName="invoiceFooter" /></label>
        <label><span>Tax rate</span><input type="number" formControlName="taxRate" /></label>
        <label><span>Currency</span><input type="text" formControlName="currency" /></label>
        <label><span>Check-in time</span><input type="text" formControlName="checkInTime" /></label>
        <label><span>Check-out time</span><input type="text" formControlName="checkOutTime" /></label>
        @if (message()) { <p>{{ message() }}</p> }
        @if (error()) { <p class="error-text">{{ error() }}</p> }
        <button type="submit" class="button button--full">Save settings</button>
      </form>
    </section>
  `
})
export class SettingsWorkspacePageComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    contactPhone: ['', Validators.required],
    logoUrl: [''],
    invoiceFooter: [''],
    taxRate: [18, Validators.required],
    currency: ['INR', Validators.required],
    checkInTime: ['14:00', Validators.required],
    checkOutTime: ['11:00', Validators.required]
  });

  constructor() {
    this.settingsService.getSettings().subscribe((settings) => {
      this.form.patchValue(settings);
    });
  }

  async save(): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(this.settingsService.updateSettings(this.form.getRawValue()));
      this.message.set('Settings saved successfully.');
    } catch {
      this.error.set('Unable to save settings.');
    }
  }
}
