import { Schema, Types, model } from 'mongoose';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceDocument {
  booking: Types.ObjectId;
  guest: Types.ObjectId;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountReason?: string;
  total: number;
  paidAmount: number;
  pdfUrl?: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    guest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lineItems: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    discountReason: { type: String },
    total: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    pdfUrl: { type: String },
    issuedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const InvoiceModel = model<InvoiceDocument>('Invoice', invoiceSchema);
