import { Schema, Types, model } from 'mongoose';

import {
  housekeepingPriorities,
  housekeepingStatuses,
  type HousekeepingPriority,
  type HousekeepingStatus
} from '../constants/enums';

export interface HousekeepingTaskDocument {
  room: Types.ObjectId;
  assignedTo: Types.ObjectId;
  assignedBy: Types.ObjectId;
  priority: HousekeepingPriority;
  status: HousekeepingStatus;
  notes?: string;
  scheduledFor: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const housekeepingTaskSchema = new Schema<HousekeepingTaskDocument>(
  {
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    priority: { type: String, enum: housekeepingPriorities, default: 'normal' },
    status: { type: String, enum: housekeepingStatuses, default: 'pending' },
    notes: { type: String },
    scheduledFor: { type: Date, required: true },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const HousekeepingTaskModel = model<HousekeepingTaskDocument>('HousekeepingTask', housekeepingTaskSchema);
