import type { Request, Response } from "express";

import { BookingModel } from "../../models/Booking";
import { HousekeepingTaskModel } from "../../models/HousekeepingTask";
import { UserModel } from "../../models/User";
import {
  buildReportPdf,
  buildWorkbookBuffer,
} from "../../services/report.service";
import { sendSuccess } from "../../utils/api";
import { asyncHandler } from "../../utils/asyncHandler";

const sendExport = async (
  request: Request,
  response: Response,
  title: string,
  rows: Record<string, unknown>[],
): Promise<boolean> => {
  const format = String(request.query.format ?? "json");

  if (format === "xlsx") {
    const buffer = buildWorkbookBuffer(title, rows);
    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${title}.xlsx`,
    );
    response.send(buffer);
    return true;
  }

  if (format === "pdf") {
    const buffer = await buildReportPdf(title, rows);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${title}.pdf`,
    );
    response.send(buffer);
    return true;
  }

  return false;
};

export const occupancyReport = asyncHandler(
  async (request: Request, response: Response) => {
    const rows = await BookingModel.aggregate([
      {
        $match: { status: { $in: ["confirmed", "checked_in", "checked_out"] } },
      },
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $project: { status: "$_id", total: 1, revenue: 1, _id: 0 } },
    ]);

    if (await sendExport(request, response, "occupancy-report", rows)) {
      return;
    }

    sendSuccess(response, rows, "Occupancy report fetched");
  },
);

export const revenueReport = asyncHandler(
  async (request: Request, response: Response) => {
    const rows = await BookingModel.aggregate([
      {
        $match: { status: { $in: ["confirmed", "checked_in", "checked_out"] } },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $group: {
          _id: "$room.type",
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $project: { roomType: "$_id", revenue: 1, bookings: 1, _id: 0 } },
    ]);

    if (await sendExport(request, response, "revenue-report", rows)) {
      return;
    }

    sendSuccess(response, rows, "Revenue report fetched");
  },
);

export const staffReport = asyncHandler(
  async (request: Request, response: Response) => {
    const rows = await HousekeepingTaskModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "staff",
        },
      },
      { $unwind: "$staff" },
      {
        $group: {
          _id: "$staff.name",
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
      { $project: { staffName: "$_id", completed: 1, total: 1, _id: 0 } },
    ]);

    if (await sendExport(request, response, "staff-report", rows)) {
      return;
    }

    sendSuccess(response, rows, "Staff report fetched");
  },
);

export const guestReport = asyncHandler(
  async (request: Request, response: Response) => {
    const rows = await UserModel.aggregate([
      { $match: { role: "guest" } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "guest",
          as: "bookings",
        },
      },
      {
        $project: {
          guestName: "$name",
          email: "$email",
          stays: { $size: "$bookings" },
          lastStayAt: { $max: "$bookings.checkOut" },
        },
      },
      { $sort: { stays: -1, guestName: 1 } },
    ]);

    if (await sendExport(request, response, "guest-report", rows)) {
      return;
    }

    sendSuccess(response, rows, "Guest report fetched");
  },
);

export const analyticsSummary = asyncHandler(
  async (_request: Request, response: Response) => {
    const [bookingStats, roomStats, housekeepingStats, guestStats] =
      await Promise.all([
        BookingModel.aggregate([
          {
            $group: {
              _id: null,
              totalBookings: { $sum: 1 },
              activeBookings: {
                $sum: {
                  $cond: [
                    {
                      $in: ["$status", ["pending", "confirmed", "checked_in"]],
                    },
                    1,
                    0,
                  ],
                },
              },
              completedBookings: {
                $sum: {
                  $cond: [{ $eq: ["$status", "checked_out"] }, 1, 0],
                },
              },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
          {
            $project: {
              _id: 0,
              totalBookings: 1,
              activeBookings: 1,
              completedBookings: 1,
              totalRevenue: 1,
            },
          },
        ]),
        (await import("../../models/Room")).RoomModel.aggregate([
          {
            $group: {
              _id: null,
              totalRooms: { $sum: 1 },
              availableRooms: {
                $sum: {
                  $cond: [{ $eq: ["$status", "available"] }, 1, 0],
                },
              },
              occupiedRooms: {
                $sum: {
                  $cond: [{ $eq: ["$status", "occupied"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalRooms: 1,
              availableRooms: 1,
              occupiedRooms: 1,
            },
          },
        ]),
        HousekeepingTaskModel.aggregate([
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: {
                $sum: {
                  $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                },
              },
              pendingTasks: {
                $sum: {
                  $cond: [
                    { $in: ["$status", ["pending", "in_progress"]] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalTasks: 1,
              completedTasks: 1,
              pendingTasks: 1,
            },
          },
        ]),
        UserModel.aggregate([
          { $match: { role: "guest" } },
          {
            $lookup: {
              from: "bookings",
              localField: "_id",
              foreignField: "guest",
              as: "bookings",
            },
          },
          {
            $group: {
              _id: null,
              totalGuests: { $sum: 1 },
              repeatGuests: {
                $sum: {
                  $cond: [{ $gt: [{ $size: "$bookings" }, 1] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalGuests: 1,
              repeatGuests: 1,
            },
          },
        ]),
      ]);

    const summary = {
      bookings: bookingStats[0] ?? {
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
      },
      rooms: roomStats[0] ?? {
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
      },
      housekeeping: housekeepingStats[0] ?? {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
      },
      guests: guestStats[0] ?? {
        totalGuests: 0,
        repeatGuests: 0,
      },
    };

    sendSuccess(response, summary, "Analytics summary fetched");
  },
);
