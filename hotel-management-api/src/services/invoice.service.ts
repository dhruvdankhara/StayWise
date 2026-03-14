import { Types } from 'mongoose';

import { BookingModel } from '../models/Booking';
import { HotelSettingsModel } from '../models/HotelSettings';
import { InvoiceModel, type InvoiceDocument, type InvoiceLineItem } from '../models/Invoice';
import { AppError } from '../utils/AppError';

const toTotal = (quantity: number, unitPrice: number): number => quantity * unitPrice;

export const upsertInvoice = async (input: {
  bookingId: string;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number }>;
  taxRate: number;
  discount: number;
  discountReason?: string;
}): Promise<InvoiceDocument | null> => {
  const booking = await BookingModel.findById(input.bookingId);

  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  const normalizedLineItems: InvoiceLineItem[] = input.lineItems.map((item) => ({
    ...item,
    total: toTotal(item.quantity, item.unitPrice)
  }));

  const subtotal = normalizedLineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * input.taxRate) / 100;
  const total = Math.max(0, subtotal + taxAmount - input.discount);

  const invoice = await InvoiceModel.findOneAndUpdate(
    { booking: new Types.ObjectId(input.bookingId) },
    {
      booking: booking._id,
      guest: booking.guest,
      lineItems: normalizedLineItems,
      subtotal,
      taxRate: input.taxRate,
      taxAmount,
      discount: input.discount,
      discountReason: input.discountReason,
      total
    },
    { new: true, upsert: true }
  );

  return invoice;
};

export const getDefaultTaxRate = async (): Promise<number> => {
  const settings = await HotelSettingsModel.findOne();
  return settings?.taxRate ?? 18;
};
