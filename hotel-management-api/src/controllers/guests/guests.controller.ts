import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

import { UserModel } from "../../models/User";
import { BookingModel } from "../../models/Booking";
import { sendSuccess } from "../../utils/api";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";

export const listGuests = asyncHandler(
  async (_request: Request, response: Response) => {
    // We can fetch guests and attach their latest booking info for the frontend
    const guests = await UserModel.find(
      { role: "guest" },
      "-passwordHash",
    ).sort({ createdAt: -1 });

    // Attach latest booking ref
    const mappedGuests = await Promise.all(
      guests.map(async (guest) => {
        const latestBooking = await BookingModel.findOne({ guest: guest._id })
          .sort({ createdAt: -1 })
          .select("bookingRef");

        return {
          ...guest.toObject(),
          latestBooking: latestBooking ? latestBooking.bookingRef : "N/A",
        };
      }),
    );

    sendSuccess(response, mappedGuests, "Guests fetched successfully");
  },
);

export const createGuest = asyncHandler(
  async (request: Request, response: Response) => {
    const { name, email, phone } = request.body;
    const existing = await UserModel.findOne({ email });

    if (existing) {
      throw new AppError(409, "Email is already in use");
    }

    // System auto-generate a generic password for guests created by receptionists and mark them verified
    const passwordHash = await bcrypt.hash("Guest@1234", 10);
    const guest = await UserModel.create({
      name,
      email,
      phone,
      role: "guest",
      passwordHash,
      isVerified: true,
    });

    const guestObj = guest.toObject();
    delete (guestObj as any).passwordHash;

    sendSuccess(response, guestObj, "Guest created successfully", 201);
  },
);
