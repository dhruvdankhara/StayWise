import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';

import { RoomService } from '../../core/services/room.service';
import { UploadService } from '../../core/services/upload.service';

const ROOM_TYPE_OPTIONS = ['single', 'double', 'suite', 'deluxe', 'family'] as const;
const ROOM_STATUS_OPTIONS = [
  'available',
  'occupied',
  'dirty',
  'maintenance',
  'out_of_order',
] as const;

@Component({
  selector: 'app-admin-rooms-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-400 mx-auto pb-12">
      <!-- Header -->
      <section class="mb-8 lg:mb-12">
        <div class="flex items-center justify-between gap-4">
          <p
            class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            {{ title().eyebrow }}
          </p>
          @if (!isFormOpen()) {
            <button
              type="button"
              class="button px-4 py-2 text-sm bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5"
              (click)="openCreateForm()"
            >
              New Room
            </button>
          }
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          {{ title().title }}
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          {{ title().description }}
        </p>
      </section>

      <!-- Main Action Grid -->
      <div class="grid grid-cols-1 gap-8 ">
        <!-- Form Side -->
        @if (isFormOpen()) {
          <div class="lg:col-span-4 lg:sticky lg:top-8">
            <form
              class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-8 relative overflow-hidden"
              [formGroup]="form"
              (ngSubmit)="save()"
            >
              <div
                class="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 blur-2xl rounded-full pointer-events-none"
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
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-neutral-900 m-0">
                  {{ editingId() ? 'Edit Room Profile' : 'Add New Room' }}
                </h2>
              </div>

              <div class="flex flex-col gap-5 relative z-10">
                <div class="grid grid-cols-2 gap-4">
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                      >Room Number</span
                    >
                    <input
                      type="text"
                      formControlName="roomNumber"
                      class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none font-bold text-neutral-900"
                    />
                  </label>
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                      >Room Type</span
                    >
                    <select
                      formControlName="type"
                      class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none capitalize cursor-pointer"
                    >
                      @for (type of roomTypeOptions; track type) {
                        <option [value]="type">{{ type }}</option>
                      }
                    </select>
                  </label>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                      >Floor Level</span
                    >
                    <input
                      type="number"
                      formControlName="floor"
                      class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                    />
                  </label>
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                      >Capacity (Pax)</span
                    >
                    <input
                      type="number"
                      formControlName="capacity"
                      class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                    />
                  </label>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                      >Base Rate (INR)</span
                    >
                    <input
                      type="number"
                      formControlName="baseRate"
                      class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none font-bold text-amber-900"
                    />
                  </label>
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                      >Current Status</span
                    >
                    <select
                      formControlName="status"
                      class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none cursor-pointer"
                    >
                      @for (status of roomStatusOptions; track status) {
                        <option [value]="status">{{ status }}</option>
                      }
                    </select>
                  </label>
                </div>

                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Room Description</span
                  >
                  <textarea
                    formControlName="description"
                    rows="2"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none resize-none"
                  ></textarea>
                </label>

                <label class="flex flex-col gap-2">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Room Features</span
                  >
                  <div
                    class="w-full p-3 bg-neutral-50 border border-black/5 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all"
                  >
                    <div class="flex flex-wrap gap-2 mb-2">
                      @for (feature of form.getRawValue().amenities; track feature) {
                        <span
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold"
                        >
                          {{ feature }}
                          <button
                            type="button"
                            class="w-4 h-4 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 leading-none"
                            (click)="removeFeature(feature)"
                            [attr.aria-label]="'Remove ' + feature"
                          >
                            x
                          </button>
                        </span>
                      }
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        [value]="featureInput()"
                        (input)="onFeatureInput($event)"
                        (keydown)="onFeatureKeydown($event)"
                        class="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm outline-none"
                        placeholder="Type feature and press Enter"
                      />
                      <button
                        type="button"
                        class="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-800 text-white hover:bg-amber-900"
                        (click)="addFeature()"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </label>

                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Upload Photo</span
                  >
                  <div class="relative group cursor-pointer">
                    <input
                      type="file"
                      (change)="upload($event)"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      class="w-full px-4 py-3 bg-neutral-50 border border-dashed border-black/20 rounded-xl group-hover:bg-white group-hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 text-sm text-neutral-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>Choose an image to upload...</span>
                    </div>
                  </div>
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
                  {{ editingId() ? 'Save Room Details' : 'Initialize New Room' }}
                </button>
                <button
                  type="button"
                  class="w-full py-2.5 text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                  (click)="resetForm()"
                >
                  {{ editingId() ? 'Cancel Edit' : 'Close Form' }}
                </button>
              </div>
            </form>
          </div>
        }

        <!-- Table Side -->
        <div class="lg:col-span-8">
          <div
            class="surface bg-white/80 backdrop-blur-xl rounded-4xl border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-neutral-900 m-0">Properties Overview</h2>
            </div>

            <div class="overflow-x-auto flex-1 p-2">
              @if (rooms$ | async; as rooms) {
                <table class="w-full text-left border-collapse min-w-125">
                  <thead>
                    <tr>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Room Details
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Current Status
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Nightly Rate
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5 align-middle">
                    @for (room of rooms; track room.id) {
                      <tr class="hover:bg-amber-50/30 transition-colors group">
                        <td class="py-4 px-6">
                          <div class="flex items-center gap-3">
                            <div
                              class="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden border border-black/5 shrink-0"
                            >
                              @if (room.images && room.images.length > 0) {
                                <img
                                  [src]="room.images[0]"
                                  class="w-full h-full object-cover"
                                  alt="Room preview"
                                />
                              } @else {
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  class="text-neutral-400"
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
                              }
                            </div>
                            <div>
                              <strong class="block text-sm font-bold text-neutral-900 font-mono">{{
                                room.roomNumber
                              }}</strong>
                              <span class="text-xs text-neutral-500 capitalize">{{
                                room.type
                              }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 px-6">
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full"
                            [class.text-emerald-700]="room.status === 'available'"
                            [class.bg-emerald-50]="room.status === 'available'"
                            [class.text-amber-700]="room.status === 'occupied'"
                            [class.bg-amber-50]="room.status === 'occupied'"
                            [class.text-orange-700]="room.status === 'dirty'"
                            [class.bg-orange-50]="room.status === 'dirty'"
                            [class.text-red-700]="room.status === 'maintenance'"
                            [class.bg-red-50]="room.status === 'maintenance'"
                            [class.text-slate-700]="room.status === 'out_of_order'"
                            [class.bg-slate-100]="room.status === 'out_of_order'"
                          >
                            <span
                              class="w-1.5 h-1.5 rounded-full"
                              [class.bg-emerald-500]="room.status === 'available'"
                              [class.bg-amber-500]="room.status === 'occupied'"
                              [class.bg-orange-500]="room.status === 'dirty'"
                              [class.bg-red-500]="room.status === 'maintenance'"
                              [class.bg-slate-500]="room.status === 'out_of_order'"
                            ></span>
                            {{ room.status }}
                          </span>
                        </td>
                        <td class="py-4 px-6 text-sm font-bold text-neutral-900">
                          {{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}
                        </td>
                        <td class="py-4 px-6">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              class="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-600 transition-colors"
                              (click)="edit(room.id)"
                              title="Edit Room"
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
                              (click)="remove(room.id)"
                              title="Deactivate Room"
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
                          No rooms configured in the system.
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
export class AdminRoomsPageComponent {
  private readonly roomService = inject(RoomService);
  private readonly uploadService = inject(UploadService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly title = signal(
    this.route.snapshot.data as { eyebrow: string; title: string; description: string },
  );
  readonly editingId = signal<string | null>(null);
  readonly isFormOpen = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly featureInput = signal('');
  readonly roomTypeOptions = ROOM_TYPE_OPTIONS;
  readonly roomStatusOptions = ROOM_STATUS_OPTIONS;
  readonly form = this.formBuilder.nonNullable.group({
    roomNumber: ['', Validators.required],
    type: ['single', Validators.required],
    floor: [1, Validators.required],
    capacity: [1, Validators.required],
    baseRate: [4500, Validators.required],
    status: ['available', Validators.required],
    description: [''],
    amenities: [['Wi-Fi'] as string[]],
    images: [[] as string[]],
  });
  readonly rooms$ = this.refresh$.pipe(switchMap(() => this.roomService.listRooms({ limit: 50 })));

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');
    const payload = {
      ...this.form.getRawValue(),
      amenities: this.form.getRawValue().amenities,
    };

    try {
      if (this.editingId()) {
        await firstValueFrom(this.roomService.updateRoom(this.editingId()!, payload));
        this.message.set('Room updated successfully.');
      } else {
        await firstValueFrom(this.roomService.createRoom(payload));
        this.message.set('Room created successfully.');
      }
      this.resetForm();
      this.refresh$.next();
    } catch {
      this.error.set('Unable to save the room.');
    }
  }

  async edit(id: string): Promise<void> {
    const room = await firstValueFrom(this.roomService.getRoom(id));
    this.isFormOpen.set(true);
    this.editingId.set(id);
    this.form.patchValue({
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      capacity: room.capacity,
      baseRate: room.baseRate,
      status: room.status,
      description: room.description ?? '',
      amenities: room.amenities,
      images: room.images,
    });
    this.featureInput.set('');
  }

  async remove(id: string): Promise<void> {
    try {
      await firstValueFrom(this.roomService.deactivateRoom(id));
      this.message.set('Room deactivated.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to deactivate the room.');
    }
  }

  async upload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    try {
      const uploaded = await firstValueFrom(this.uploadService.upload(file));
      this.form.patchValue({
        images: [...this.form.getRawValue().images, uploaded.url],
      });
      this.message.set('Image uploaded successfully.');
    } catch {
      this.error.set('Unable to upload the image.');
    }
  }

  onFeatureInput(event: Event): void {
    this.featureInput.set((event.target as HTMLInputElement).value);
  }

  onFeatureKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      this.addFeature(event);
    }
  }

  addFeature(event?: KeyboardEvent): void {
    if (event) {
      event.preventDefault();
    }

    const value = this.featureInput().trim();
    if (!value) {
      return;
    }

    const current = this.form.getRawValue().amenities;
    if (current.some((item) => item.toLowerCase() === value.toLowerCase())) {
      this.featureInput.set('');
      return;
    }

    this.form.patchValue({ amenities: [...current, value] });
    this.featureInput.set('');
  }

  removeFeature(feature: string): void {
    const updated = this.form
      .getRawValue()
      .amenities.filter((item) => item.toLowerCase() !== feature.toLowerCase());
    this.form.patchValue({ amenities: updated });
  }

  openCreateForm(): void {
    this.error.set('');
    this.message.set('');
    this.editingId.set(null);
    this.isFormOpen.set(true);
    this.form.reset({
      roomNumber: '',
      type: 'single',
      floor: 1,
      capacity: 1,
      baseRate: 4500,
      status: 'available',
      description: '',
      amenities: ['Wi-Fi'],
      images: [],
    });
    this.featureInput.set('');
  }

  resetForm(): void {
    this.editingId.set(null);
    this.isFormOpen.set(false);
    this.form.reset({
      roomNumber: '',
      type: 'single',
      floor: 1,
      capacity: 1,
      baseRate: 4500,
      status: 'available',
      description: '',
      amenities: ['Wi-Fi'],
      images: [],
    });
    this.featureInput.set('');
  }
}
