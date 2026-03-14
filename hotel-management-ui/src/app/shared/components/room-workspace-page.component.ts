import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom, switchMap } from 'rxjs';

import { RoomService } from '../../core/services/room.service';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-room-workspace-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ title().eyebrow }}</p>
          <h1>{{ title().title }}</h1>
          <p>{{ title().description }}</p>
        </div>
      </div>
      <div class="section-grid">
        <form class="surface auth-form" [formGroup]="form" (ngSubmit)="save()">
          <label><span>Room number</span><input type="text" formControlName="roomNumber" /></label>
          <label><span>Type</span><input type="text" formControlName="type" /></label>
          <label><span>Floor</span><input type="number" formControlName="floor" /></label>
          <label><span>Capacity</span><input type="number" formControlName="capacity" /></label>
          <label><span>Base rate</span><input type="number" formControlName="baseRate" /></label>
          <label><span>Status</span><input type="text" formControlName="status" /></label>
          <label><span>Description</span><input type="text" formControlName="description" /></label>
          <label><span>Image upload</span><input type="file" (change)="upload($event)" /></label>
          @if (message()) { <p>{{ message() }}</p> }
          @if (error()) { <p class="error-text">{{ error() }}</p> }
          <button type="submit" class="button button--full">{{ editingId() ? 'Save room' : 'Create room' }}</button>
        </form>
        <div class="surface table-shell">
          @if (rooms$ | async; as rooms) {
            <table>
              <thead><tr><th>Room</th><th>Status</th><th>Rate</th><th></th></tr></thead>
              <tbody>
                @for (room of rooms; track room.id) {
                  <tr>
                    <td>{{ room.roomNumber }} · {{ room.type }}</td>
                    <td><span class="pill">{{ room.status }}</span></td>
                    <td>{{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                    <td>
                      <button type="button" class="button button--ghost" (click)="edit(room.id)">Edit</button>
                      <button type="button" class="button button--ghost" (click)="remove(room.id)">Deactivate</button>
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
export class RoomWorkspacePageComponent {
  private readonly roomService = inject(RoomService);
  private readonly uploadService = inject(UploadService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly title = signal(this.route.snapshot.data as { eyebrow: string; title: string; description: string });
  readonly editingId = signal<string | null>(null);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    roomNumber: ['', Validators.required],
    type: ['', Validators.required],
    floor: [1, Validators.required],
    capacity: [1, Validators.required],
    baseRate: [4500, Validators.required],
    status: ['available', Validators.required],
    description: [''],
    amenities: ['Wi-Fi'],
    images: [[] as string[]]
  });
  readonly rooms$ = this.refresh$.pipe(switchMap(() => this.roomService.listRooms({ limit: 50 })));

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');
    const payload = {
      ...this.form.getRawValue(),
      amenities: this.form.getRawValue().amenities.split(',').map((item) => item.trim()).filter(Boolean)
    };

    try {
      if (this.editingId()) {
        await firstValueFrom(this.roomService.updateRoom(this.editingId()!, payload));
        this.message.set('Room updated successfully.');
      } else {
        await firstValueFrom(this.roomService.createRoom(payload));
        this.message.set('Room created successfully.');
      }
      this.refresh$.next();
    } catch {
      this.error.set('Unable to save the room.');
    }
  }

  async edit(id: string): Promise<void> {
    const room = await firstValueFrom(this.roomService.getRoom(id));
    this.editingId.set(id);
    this.form.patchValue({
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      capacity: room.capacity,
      baseRate: room.baseRate,
      status: room.status,
      description: room.description ?? '',
      amenities: room.amenities.join(', '),
      images: room.images
    });
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
        images: [...this.form.getRawValue().images, uploaded.url]
      });
      this.message.set('Image uploaded successfully.');
    } catch {
      this.error.set('Unable to upload the image.');
    }
  }
}
