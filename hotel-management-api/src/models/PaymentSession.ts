import { Schema, Types, model } from "mongoose";

export interface PaymentSessionDocument {
  actor?: Types.ObjectId;
  guest: Types.ObjectId;
  room: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  specialRequests?: string;
  amount: number;
  currency: string;
  provider: "razorpay";
  providerOrderId: string;
  providerPaymentId?: string;
  status: "created" | "verified" | "failed" | "expired";
  expiresAt: Date;
  verifiedAt?: Date;
  booking?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSessionSchema = new Schema<PaymentSessionDocument>(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    guest: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    specialRequests: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    provider: { type: String, enum: ["razorpay"], default: "razorpay" },
    providerOrderId: { type: String, required: true, index: true },
    providerPaymentId: { type: String },
    status: {
      type: String,
      enum: ["created", "verified", "failed", "expired"],
      default: "created",
      index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
    verifiedAt: { type: Date },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const PaymentSessionModel = model<PaymentSessionDocument>(
  "PaymentSession",
  paymentSessionSchema,
);
