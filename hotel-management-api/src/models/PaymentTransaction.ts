import { Schema, Types, model } from 'mongoose';

import { paymentMethods, type PaymentMethod } from '../constants/enums';

export interface PaymentTransactionDocument {
  booking: Types.ObjectId;
  invoice?: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  provider: 'razorpay' | 'manual';
  providerPaymentId?: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<PaymentTransactionDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: paymentMethods, required: true },
    provider: { type: String, enum: ['razorpay', 'manual'], required: true },
    providerPaymentId: { type: String },
    status: {
      type: String,
      enum: ['created', 'captured', 'failed', 'refunded'],
      default: 'created'
    },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const PaymentTransactionModel = model<PaymentTransactionDocument>('PaymentTransaction', paymentTransactionSchema);
