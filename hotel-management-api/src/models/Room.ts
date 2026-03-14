import { Schema, model } from 'mongoose';

import { roomStatuses, roomTypes, type RoomStatus, type RoomType } from '../constants/enums';

export interface RoomDocument {
  roomNumber: string;
  type: RoomType;
  floor: number;
  capacity: number;
  baseRate: number;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<RoomDocument>(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: roomTypes, required: true },
    floor: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    baseRate: { type: Number, required: true, min: 0 },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String }],
    status: { type: String, enum: roomStatuses, default: 'available' },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const RoomModel = model<RoomDocument>('Room', roomSchema);
