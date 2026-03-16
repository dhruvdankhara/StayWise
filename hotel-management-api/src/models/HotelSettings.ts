import { Schema, model } from 'mongoose';

export interface HotelSettingsDocument {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  invoiceFooter: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const hotelSettingsSchema = new Schema<HotelSettingsDocument>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    logoUrl: { type: String },
    invoiceFooter: { type: String, default: 'Thank you for choosing StayWise.' },
    currency: { type: String, default: 'INR' },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' }
  },
  { timestamps: true }
);

export const HotelSettingsModel = model<HotelSettingsDocument>('HotelSettings', hotelSettingsSchema);
