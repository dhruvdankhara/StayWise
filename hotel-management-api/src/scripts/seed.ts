import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDatabase } from "../config/db";
import { HotelSettingsModel } from "../models/HotelSettings";
import { RoomModel } from "../models/Room";
import { UserModel } from "../models/User";
import { BookingModel } from "../models/Booking";
import { HousekeepingTaskModel } from "../models/HousekeepingTask";
import { ReviewModel } from "../models/Review";
import { upsertInvoice } from "../services/invoice.service";

const seed = async (): Promise<void> => {
  await connectDatabase();

  await Promise.all([
    HotelSettingsModel.deleteMany({}),
    RoomModel.deleteMany({}),
    UserModel.deleteMany({}),
    BookingModel.deleteMany({}),
    HousekeepingTaskModel.deleteMany({}),
    ReviewModel.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const users = await UserModel.insertMany([
    {
      name: "Aarav Mehta",
      email: "admin@staywise.com",
      phone: "9876500001",
      passwordHash,
      role: "admin",
      isVerified: true,
    },
    {
      name: "Naina Kapoor",
      email: "manager@staywise.com",
      phone: "9876500002",
      passwordHash,
      role: "hotel_manager",
      isVerified: true,
    },
    {
      name: "Rohit Sharma",
      email: "reception@staywise.com",
      phone: "9876500003",
      passwordHash,
      role: "receptionist",
      isVerified: true,
    },
    {
      name: "Pooja Singh",
      email: "cleaning@staywise.com",
      phone: "9876500004",
      passwordHash,
      role: "cleaning_staff",
      isVerified: true,
    },
    {
      name: "Ishita Verma",
      email: "guest@staywise.com",
      phone: "9876500005",
      passwordHash,
      role: "guest",
      isVerified: true,
    },
  ]);

  await HotelSettingsModel.create({
    name: "StayWise Grand Hotel",
    address: "21 Residency Avenue, Jaipur, Rajasthan",
    contactEmail: "hello@staywise.com",
    contactPhone: "+91 98765 43210",
    invoiceFooter: "Thank you for choosing StayWise.",
    currency: "INR",
    checkInTime: "14:00",
    checkOutTime: "11:00",
  });

  const rooms = await RoomModel.insertMany([
    {
      roomNumber: "101",
      type: "single",
      floor: 1,
      capacity: 1,
      baseRate: 4500,
      amenities: ["Wi-Fi", "Breakfast", "Smart TV"],
      images: [],
      status: "available",
      description: "Compact city-view single room",
    },
    {
      roomNumber: "204",
      type: "deluxe",
      floor: 2,
      capacity: 2,
      baseRate: 7200,
      amenities: ["Wi-Fi", "Breakfast", "Bathtub", "Workspace"],
      images: [],
      status: "available",
      description: "Spacious deluxe room with lounge seating",
    },
    {
      roomNumber: "305",
      type: "suite",
      floor: 3,
      capacity: 4,
      baseRate: 12000,
      amenities: ["Wi-Fi", "Breakfast", "Living Area", "Mini Bar"],
      images: [],
      status: "available",
      description: "Premium suite for long or family stays",
    },
  ]);

  const activeBooking = await BookingModel.create({
    bookingRef: "SW-SEED-001",
    guest: users[4]._id,
    room: rooms[1]._id,
    checkIn: new Date("2026-03-16T12:00:00.000Z"),
    checkOut: new Date("2026-03-18T10:00:00.000Z"),
    guests: 2,
    status: "confirmed",
    paymentMethod: "cash",
    totalAmount: 14400,
    paymentStatus: "partial",
    specialRequests: "Late check-in",
    createdBy: users[2]._id,
  });

  const completedBooking = await BookingModel.create({
    bookingRef: "SW-SEED-002",
    guest: users[4]._id,
    room: rooms[0]._id,
    checkIn: new Date("2026-03-10T12:00:00.000Z"),
    checkOut: new Date("2026-03-12T10:00:00.000Z"),
    actualCheckIn: new Date("2026-03-10T12:30:00.000Z"),
    actualCheckOut: new Date("2026-03-12T10:05:00.000Z"),
    guests: 1,
    status: "checked_out",
    paymentMethod: "cash",
    totalAmount: 9000,
    paymentStatus: "paid",
    createdBy: users[2]._id,
  });

  await upsertInvoice({
    bookingId: activeBooking.id,
    lineItems: [
      { description: "Deluxe room stay", quantity: 2, unitPrice: 7200 },
    ],
    discount: 500,
    discountReason: "Loyalty guest",
  });

  await HousekeepingTaskModel.create({
    room: rooms[0]._id,
    assignedTo: users[3]._id,
    assignedBy: users[1]._id,
    priority: "normal",
    status: "pending",
    notes: "Prepare room for early arrival",
    scheduledFor: new Date("2026-03-15T05:00:00.000Z"),
  });

  await ReviewModel.create({
    booking: completedBooking._id,
    guest: users[4]._id,
    room: rooms[0]._id,
    rating: 5,
    comment: "Elegant interiors and very responsive staff.",
    isVisible: true,
  });

  console.log("Seed complete. Demo password for all users: Password@123");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
