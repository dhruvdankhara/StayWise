import { Schema, Types, model } from "mongoose";

import {
  bookingStatuses,
  paymentMethods,
  paymentStatuses,
  type BookingStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "../constants/enums";

export interface BookingDocument {
  bookingRef: string;
  guest: Types.ObjectId;
  room: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  actualCheckIn?: Date;
  actualCheckOut?: Date;
  guests: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdBy?: Types.ObjectId;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    bookingRef: { type: String, required: true, unique: true },
    guest: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    actualCheckIn: { type: Date },
    actualCheckOut: { type: Date },
    guests: { type: Number, required: true, min: 1 },
    status: { type: String, enum: bookingStatuses, default: "pending" },
    paymentMethod: { type: String, enum: paymentMethods, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: paymentStatuses, default: "unpaid" },
    specialRequests: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String },
  },
  { timestamps: true },
);

export const BookingModel = model<BookingDocument>("Booking", bookingSchema);
