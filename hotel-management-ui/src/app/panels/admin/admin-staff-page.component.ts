import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';

import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-admin-staff-page',
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
          Staff Directory
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Team Management
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Create, update, and deactivate operational staff accounts across all departments.
        </p>
      </section>

      <!-- Main Action Grid -->
      <div class="grid grid-cols-1 gap-8 ">
        <!-- Form Side -->
        <div class="w-full">
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-neutral-900 m-0">
                {{ editingId() ? 'Update member' : 'Add new member' }}
              </h2>
            </div>

            <div class="flex flex-col gap-5 relative z-10">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Full Name</span
                >
                <input
                  type="text"
                  formControlName="name"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Email Address</span
                >
                <input
                  type="email"
                  formControlName="email"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Phone Number</span
                >
                <input
                  type="tel"
                  formControlName="phone"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Role Assignment</span
                >
                <select
                  formControlName="role"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none cursor-pointer"
                >
                  <option value="receptionist">Receptionist</option>
                  <option value="cleaning_staff">Cleaning Staff</option>
                </select>
              </label>

              @if (!editingId()) {
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Temporary Password</span
                  >
                  <input
                    type="password"
                    formControlName="password"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  />
                </label>
              }
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
                {{ editingId() ? 'Save changes' : 'Create account' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Table Side -->
        <div class="lg:col-span-8">
          <div
            class="surface bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
          >
            <div class="p-6 border-b border-black/5 bg-neutral-50/50 flex items-center gap-4">
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-neutral-900 m-0">Active Directory</h2>
            </div>

            <div class="overflow-x-auto flex-1 p-2">
              @if (staff$ | async; as staff) {
                <table class="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Employee
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Contact
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        System Role
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5 align-middle">
                    @for (member of staff; track member.id) {
                      <tr class="hover:bg-amber-50/30 transition-colors group">
                        <td class="py-4 px-6">
                          <div class="flex items-center gap-3">
                            <div
                              class="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold text-xs uppercase shrink-0"
                            >
                              {{ member.name.charAt(0) || 'U' }}
                            </div>
                            <strong class="block text-sm font-bold text-neutral-900">{{
                              member.name
                            }}</strong>
                          </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-neutral-500 font-medium">
                          {{ member.email }}
                        </td>
                        <td class="py-4 px-6">
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full"
                            [class.text-emerald-700]="member.role === 'receptionist'"
                            [class.bg-emerald-50]="member.role === 'receptionist'"
                            [class.text-blue-700]="member.role === 'cleaning_staff'"
                            [class.bg-blue-50]="member.role === 'cleaning_staff'"
                          >
                            <span
                              class="w-1.5 h-1.5 rounded-full"
                              [class.bg-emerald-500]="member.role === 'receptionist'"
                              [class.bg-blue-500]="member.role === 'cleaning_staff'"
                            ></span>
                            {{ member.role.replace('_', ' ') }}
                          </span>
                        </td>
                        <td class="py-4 px-6">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              class="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-600 transition-colors"
                              (click)="edit(member.id)"
                              title="Edit Employee"
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
                            <button
                              type="button"
                              class="w-8 h-8 rounded-full bg-white hover:bg-red-50 border border-black/10 flex items-center justify-center text-red-600 hover:text-red-700 hover:border-red-200 transition-colors"
                              (click)="deactivate(member.id)"
                              title="Deactivate Employee"
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
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="4" class="py-16 text-center text-neutral-500">
                          No staff members found in directory.
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
export class AdminStaffPageComponent {
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
    password: ['Password@123', Validators.required],
  });
  readonly staff$ = this.refresh$.pipe(switchMap(() => this.staffService.listStaff()));

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');

    try {
      if (this.editingId()) {
        await firstValueFrom(
          this.staffService.updateStaff(this.editingId()!, this.form.getRawValue()),
        );
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
      role: member.role,
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
