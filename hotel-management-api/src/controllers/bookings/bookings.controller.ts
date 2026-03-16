import { Types } from "mongoose";
import type { Request, Response } from "express";

import { BookingModel } from "../../models/Booking";
import { HousekeepingTaskModel } from "../../models/HousekeepingTask";
import { RoomModel } from "../../models/Room";
import { UserModel } from "../../models/User";
import { createAuditLog } from "../../services/audit.service";
import {
  calculateBookingAmount,
  ensureRoomAvailability,
  generateBookingReference,
} from "../../services/booking.service";
import { upsertInvoice } from "../../services/invoice.service";
import { sendSuccess } from "../../utils/api";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { getPagination } from "../../utils/pagination";

const getGuestId = (guest: unknown): string => {
  if (guest && typeof guest === "object" && "_id" in guest) {
    return String((guest as { _id: unknown })._id);
  }

  return String(guest);
};

const isOwnBooking = (request: Request, bookingGuestId: string): boolean =>
  request.user?.role === "guest" && request.user.id === bookingGuestId;

export const listBookings = asyncHandler(
  async (request: Request, response: Response) => {
    const { limit, page, skip } = getPagination(
      request.query as Record<string, unknown>,
    );
    const filters: Record<string, unknown> = {};

    if (request.user?.role === "guest") {
      filters.guest = new Types.ObjectId(request.user.id);
    }

    if (request.query.status) {
      filters.status = request.query.status;
    }

    const [items, total] = await Promise.all([
      BookingModel.find(filters)
        .populate("guest", "name email phone")
        .populate("room", "roomNumber type floor")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments(filters),
    ]);

    sendSuccess(response, { items, page, limit, total }, "Bookings fetched");
  },
);

export const listMyBookings = asyncHandler(
  async (request: Request, response: Response) => {
    const bookings = await BookingModel.find({ guest: request.user?.id })
      .populate("room", "roomNumber type images baseRate")
      .sort({ createdAt: -1 });

    sendSuccess(response, bookings, "Guest bookings fetched");
  },
);

export const getBooking = asyncHandler(
  async (request: Request, response: Response) => {
    const booking = await BookingModel.findById(request.params.id)
      .populate("guest", "name email phone")
      .populate("room", "roomNumber type floor capacity baseRate");

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    if (
      request.user?.role === "guest" &&
      !isOwnBooking(request, getGuestId(booking.guest))
    ) {
      throw new AppError(403, "You do not have access to this booking");
    }

    sendSuccess(response, booking, "Booking fetched");
  },
);

export const createBooking = asyncHandler(
  async (request: Request, response: Response) => {
    const checkIn = new Date(request.body.checkIn);
    const checkOut = new Date(request.body.checkOut);

    if (checkOut <= checkIn) {
      throw new AppError(400, "Check-out must be after check-in");
    }

    await ensureRoomAvailability(request.body.roomId, checkIn, checkOut);

    const guestId =
      request.user?.role === "guest" ? request.user.id : request.body.guestId;

    if (!guestId) {
      throw new AppError(400, "guestId is required for staff-created bookings");
    }

    const totalAmount = await calculateBookingAmount(
      request.body.roomId,
      checkIn,
      checkOut,
    );

    const booking = await BookingModel.create({
      bookingRef: generateBookingReference(),
      guest: new Types.ObjectId(guestId),
      room: new Types.ObjectId(request.body.roomId),
      checkIn,
      checkOut,
      guests: request.body.guests,
      status: request.user?.role === "guest" ? "pending" : "confirmed",
      totalAmount,
      paymentStatus: "unpaid",
      specialRequests: request.body.specialRequests,
      createdBy: request.user ? new Types.ObjectId(request.user.id) : undefined,
    });

    await createAuditLog({
      actor: request.user?.id,
      action: "create_booking",
      entity: "booking",
      entityId: booking.id,
    });

    sendSuccess(response, booking, "Booking created", 201);
  },
);

export const updateBooking = asyncHandler(
  async (request: Request, response: Response) => {
    const existing = await BookingModel.findById(request.params.id);

    if (!existing) {
      throw new AppError(404, "Booking not found");
    }

    const roomId = request.body.roomId ?? String(existing.room);
    const checkIn = request.body.checkIn
      ? new Date(request.body.checkIn)
      : existing.checkIn;
    const checkOut = request.body.checkOut
      ? new Date(request.body.checkOut)
      : existing.checkOut;

    await ensureRoomAvailability(roomId, checkIn, checkOut, existing.id);

    const totalAmount = await calculateBookingAmount(roomId, checkIn, checkOut);
    const booking = await BookingModel.findByIdAndUpdate(
      request.params.id,
      {
        ...request.body,
        room: new Types.ObjectId(roomId),
        checkIn,
        checkOut,
        totalAmount,
      },
      { new: true, runValidators: true },
    );

    sendSuccess(response, booking, "Booking updated");
  },
);

export const checkIn = asyncHandler(
  async (request: Request, response: Response) => {
    const booking = await BookingModel.findById(request.params.id);

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    booking.status = "checked_in";
    booking.actualCheckIn = new Date();
    await booking.save();
    await RoomModel.findByIdAndUpdate(booking.room, { status: "occupied" });

    sendSuccess(response, booking, "Guest checked in");
  },
);

export const checkOut = asyncHandler(
  async (request: Request, response: Response) => {
    const booking = await BookingModel.findById(request.params.id);

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    booking.status = "checked_out";
    booking.actualCheckOut = new Date();
    await booking.save();
    await RoomModel.findByIdAndUpdate(booking.room, { status: "dirty" });

    const cleaner = await UserModel.findOne({
      role: "cleaning_staff",
      isActive: true,
    }).sort({ createdAt: 1 });

    if (cleaner && request.user) {
      await HousekeepingTaskModel.create({
        room: booking.room,
        assignedTo: cleaner._id,
        assignedBy: new Types.ObjectId(request.user.id),
        priority: "high",
        status: "pending",
        scheduledFor: new Date(),
        notes: "Auto-created after guest check-out",
      });
    }

    await upsertInvoice({
      bookingId: booking.id,
      lineItems: [
        {
          description: "Room stay charges",
          quantity: 1,
          unitPrice: booking.totalAmount,
        },
      ],
      discount: 0,
    });

    sendSuccess(response, booking, "Guest checked out");
  },
);

export const cancelBooking = asyncHandler(
  async (request: Request, response: Response) => {
    const booking = await BookingModel.findById(request.params.id);

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    if (
      request.user?.role === "guest" &&
      !isOwnBooking(request, String(booking.guest))
    ) {
      throw new AppError(403, "You do not have access to this booking");
    }

    booking.status = "cancelled";
    booking.cancellationReason = request.body.reason;
    await booking.save();
    await RoomModel.findByIdAndUpdate(booking.room, { status: "available" });

    await createAuditLog({
      actor: request.user?.id,
      action: "cancel_booking",
      entity: "booking",
      entityId: booking.id,
      reason: request.body.reason,
    });

    sendSuccess(response, booking, "Booking cancelled");
  },
);
