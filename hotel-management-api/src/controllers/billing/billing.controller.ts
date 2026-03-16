import type { Request, Response } from "express";

import { BookingModel } from "../../models/Booking";
import { InvoiceModel } from "../../models/Invoice";
import { PaymentTransactionModel } from "../../models/PaymentTransaction";
import { HotelSettingsModel } from "../../models/HotelSettings";
import { buildPdfBuffer } from "../../services/pdf.service";
import { upsertInvoice } from "../../services/invoice.service";
import { sendSuccess } from "../../utils/api";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";

const ensureBookingAccess = async (
  bookingId: string,
  userId?: string,
  role?: string,
) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (role === "guest" && String(booking.guest) !== userId) {
    throw new AppError(403, "You do not have access to this invoice");
  }

  return booking;
};

const getGuestName = (guest: unknown): string => {
  if (guest && typeof guest === "object" && "name" in guest) {
    return String((guest as { name?: string }).name ?? "");
  }

  return "";
};

export const getInvoice = asyncHandler(
  async (request: Request, response: Response) => {
    await ensureBookingAccess(
      String(request.params.bookingId),
      request.user?.id,
      request.user?.role,
    );
    const invoice = await InvoiceModel.findOne({
      booking: request.params.bookingId,
    }).populate("guest", "name email");

    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }

    sendSuccess(response, invoice, "Invoice fetched");
  },
);

export const createInvoice = asyncHandler(
  async (request: Request, response: Response) => {
    await ensureBookingAccess(
      String(request.params.bookingId),
      request.user?.id,
      request.user?.role,
    );
    const invoice = await upsertInvoice({
      bookingId: String(request.params.bookingId),
      lineItems: request.body.lineItems,
      discount: request.body.discount,
      discountReason: request.body.discountReason,
    });

    sendSuccess(response, invoice, "Invoice generated");
  },
);

export const addCharge = asyncHandler(
  async (request: Request, response: Response) => {
    const existingInvoice = await InvoiceModel.findOne({
      booking: request.params.bookingId,
    });

    if (!existingInvoice) {
      throw new AppError(404, "Invoice not found");
    }

    const nextLineItems = [
      ...existingInvoice.lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      request.body,
    ];

    const invoice = await upsertInvoice({
      bookingId: String(request.params.bookingId),
      lineItems: nextLineItems,
      discount: existingInvoice.discount,
      discountReason: existingInvoice.discountReason,
    });

    sendSuccess(response, invoice, "Extra charge added");
  },
);

export const recordPayment = asyncHandler(
  async (request: Request, response: Response) => {
    const booking = await ensureBookingAccess(
      String(request.params.bookingId),
      request.user?.id,
      request.user?.role,
    );
    const invoice = await InvoiceModel.findOne({
      booking: request.params.bookingId,
    });

    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }

    invoice.paidAmount += request.body.amount;
    await invoice.save();

    booking.paymentStatus =
      invoice.paidAmount >= invoice.total ? "paid" : "partial";
    await booking.save();

    const transaction = await PaymentTransactionModel.create({
      booking: booking._id,
      invoice: invoice._id,
      amount: request.body.amount,
      method: request.body.method,
      provider: request.body.method === "online" ? "razorpay" : "manual",
      providerPaymentId: request.body.providerPaymentId,
      status: "captured",
    });

    sendSuccess(
      response,
      { invoice, transaction, paymentStatus: booking.paymentStatus },
      "Payment recorded",
    );
  },
);

export const downloadInvoicePdf = asyncHandler(
  async (request: Request, response: Response) => {
    await ensureBookingAccess(
      String(request.params.bookingId),
      request.user?.id,
      request.user?.role,
    );
    const invoice = await InvoiceModel.findOne({
      booking: request.params.bookingId,
    }).populate("guest", "name email");
    const settings = await HotelSettingsModel.findOne();

    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }

    const buffer = await buildPdfBuffer(`Invoice ${invoice.id}`, [
      settings?.name ?? "StayWise",
      `Guest: ${getGuestName(invoice.guest)}`,
      `Subtotal: ${invoice.subtotal}`,
      `Discount: ${invoice.discount}`,
      `Total: ${invoice.total}`,
      `Paid: ${invoice.paidAmount}`,
      ...invoice.lineItems.map(
        (item) =>
          `${item.description} - ${item.quantity} x ${item.unitPrice} = ${item.total}`,
      ),
    ]);

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${request.params.bookingId}.pdf`,
    );
    response.send(buffer);
  },
);
