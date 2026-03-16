import crypto from "crypto";
import type { Request, Response } from "express";
import { Types } from "mongoose";

import { env } from "../../config/env";
import { razorpayClient } from "../../config/razorpay";
import { BookingModel } from "../../models/Booking";
import { InvoiceModel } from "../../models/Invoice";
import { PaymentSessionModel } from "../../models/PaymentSession";
import { PaymentTransactionModel } from "../../models/PaymentTransaction";
import { HotelSettingsModel } from "../../models/HotelSettings";
import { createAuditLog } from "../../services/audit.service";
import {
  calculateBookingAmount,
  ensureRoomAvailability,
  generateBookingReference,
} from "../../services/booking.service";
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

const toPaise = (amount: number): number => Math.round(amount * 100);

const resolveGuestId = (request: Request): string => {
  if (request.user?.role === "guest") {
    return request.user.id;
  }

  if (!request.body.guestId) {
    throw new AppError(
      400,
      "guestId is required for staff-initiated online payment",
    );
  }

  return String(request.body.guestId);
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

export const createOnlineOrder = asyncHandler(
  async (request: Request, response: Response) => {
    if (!razorpayClient || !env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new AppError(503, "Online payment is not configured");
    }

    const guestId = resolveGuestId(request);
    const checkIn = new Date(request.body.checkIn);
    const checkOut = new Date(request.body.checkOut);

    if (checkOut <= checkIn) {
      throw new AppError(400, "Check-out must be after check-in");
    }

    await ensureRoomAvailability(
      String(request.body.roomId),
      checkIn,
      checkOut,
    );

    const totalAmount = await calculateBookingAmount(
      String(request.body.roomId),
      checkIn,
      checkOut,
    );

    const order = await razorpayClient.orders.create({
      amount: toPaise(totalAmount),
      currency: "INR",
      receipt: `sw-${Date.now().toString(36)}`,
    });

    const session = await PaymentSessionModel.create({
      actor: request.user?.id ? new Types.ObjectId(request.user.id) : undefined,
      guest: new Types.ObjectId(guestId),
      room: new Types.ObjectId(String(request.body.roomId)),
      checkIn,
      checkOut,
      guests: request.body.guests,
      specialRequests: request.body.specialRequests,
      amount: totalAmount,
      currency: "INR",
      provider: "razorpay",
      providerOrderId: order.id,
      status: "created",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      metadata: {
        role: request.user?.role,
      },
    });

    sendSuccess(
      response,
      {
        sessionId: session.id,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: env.RAZORPAY_KEY_ID,
      },
      "Online payment order created",
      201,
    );
  },
);

export const verifyOnlinePayment = asyncHandler(
  async (request: Request, response: Response) => {
    const session = await PaymentSessionModel.findById(request.body.sessionId);

    if (!session) {
      throw new AppError(404, "Payment session not found");
    }

    if (session.status !== "created") {
      throw new AppError(400, "Payment session is not active");
    }

    if (session.expiresAt.getTime() < Date.now()) {
      session.status = "expired";
      await session.save();
      throw new AppError(400, "Payment session has expired");
    }

    if (session.providerOrderId !== request.body.razorpayOrderId) {
      throw new AppError(400, "Order mismatch for payment session");
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(
        `${request.body.razorpayOrderId}|${request.body.razorpayPaymentId}`,
      )
      .digest("hex");

    if (expectedSignature !== request.body.razorpaySignature) {
      session.status = "failed";
      await session.save();
      throw new AppError(400, "Invalid payment signature");
    }

    await ensureRoomAvailability(
      String(session.room),
      session.checkIn,
      session.checkOut,
    );

    const amount = await calculateBookingAmount(
      String(session.room),
      session.checkIn,
      session.checkOut,
    );

    const booking = await BookingModel.create({
      bookingRef: generateBookingReference(),
      guest: session.guest,
      room: session.room,
      checkIn: session.checkIn,
      checkOut: session.checkOut,
      guests: session.guests,
      status: "confirmed",
      paymentMethod: "online",
      totalAmount: amount,
      paymentStatus: "paid",
      specialRequests: session.specialRequests,
      createdBy: session.actor,
    });

    const invoice = await upsertInvoice({
      bookingId: booking.id,
      lineItems: [
        {
          description: "Room stay charges",
          quantity: 1,
          unitPrice: amount,
        },
      ],
      discount: 0,
    });

    const invoiceId = invoice
      ? new Types.ObjectId(String((invoice as unknown as { _id: unknown })._id))
      : undefined;

    if (invoiceId) {
      await InvoiceModel.findByIdAndUpdate(invoiceId, {
        paidAmount: invoice?.total ?? 0,
      });
    }

    await PaymentTransactionModel.create({
      booking: booking._id,
      invoice: invoiceId,
      amount,
      method: "online",
      provider: "razorpay",
      providerPaymentId: request.body.razorpayPaymentId,
      status: "captured",
      metadata: {
        orderId: request.body.razorpayOrderId,
        sessionId: session.id,
      },
    });

    session.providerPaymentId = request.body.razorpayPaymentId;
    session.status = "verified";
    session.verifiedAt = new Date();
    session.booking = booking._id;
    await session.save();

    await createAuditLog({
      actor: request.user?.id,
      action: "online_booking_payment_verified",
      entity: "booking",
      entityId: booking.id,
      metadata: {
        sessionId: session.id,
        orderId: request.body.razorpayOrderId,
      },
    });

    sendSuccess(
      response,
      booking,
      "Online payment verified and booking confirmed",
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
