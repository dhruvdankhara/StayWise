import { Types } from 'mongoose';

import { BookingModel } from '../models/Booking';
import { HotelSettingsModel } from '../models/HotelSettings';
import { InvoiceModel, type InvoiceDocument, type InvoiceLineItem } from '../models/Invoice';
import { AppError } from '../utils/AppError';

const toTotal = (quantity: number, unitPrice: number): number => quantity * unitPrice;

export const upsertInvoice = async (input: {
  bookingId: string;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number }>;
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
  
  const total = Math.max(0, subtotal - input.discount);

  const invoice = await InvoiceModel.findOneAndUpdate(
    { booking: new Types.ObjectId(input.bookingId) },
    {
      booking: booking._id,
      guest: booking.guest,
      lineItems: normalizedLineItems,
      subtotal,
      discount: input.discount,
      discountReason: input.discountReason,
      total
    },
    { new: true, upsert: true }
  );

  return invoice;
};


