import type { Request, Response } from 'express';

import { BookingModel } from '../../models/Booking';
import { HousekeepingTaskModel } from '../../models/HousekeepingTask';
import { UserModel } from '../../models/User';
import { buildReportPdf, buildWorkbookBuffer } from '../../services/report.service';
import { sendSuccess } from '../../utils/api';
import { asyncHandler } from '../../utils/asyncHandler';

const sendExport = async (
  request: Request,
  response: Response,
  title: string,
  rows: Record<string, unknown>[]
): Promise<boolean> => {
  const format = String(request.query.format ?? 'json');

  if (format === 'xlsx') {
    const buffer = buildWorkbookBuffer(title, rows);
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', `attachment; filename=${title}.xlsx`);
    response.send(buffer);
    return true;
  }

  if (format === 'pdf') {
    const buffer = await buildReportPdf(title, rows);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`);
    response.send(buffer);
    return true;
  }

  return false;
};

export const occupancyReport = asyncHandler(async (request: Request, response: Response) => {
  const rows = await BookingModel.aggregate([
    { $match: { status: { $in: ['confirmed', 'checked_in', 'checked_out'] } } },
    { $group: { _id: '$status', total: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $project: { status: '$_id', total: 1, revenue: 1, _id: 0 } }
  ]);

  if (await sendExport(request, response, 'occupancy-report', rows)) {
    return;
  }

  sendSuccess(response, rows, 'Occupancy report fetched');
});

export const revenueReport = asyncHandler(async (request: Request, response: Response) => {
  const rows = await BookingModel.aggregate([
    { $match: { status: { $in: ['confirmed', 'checked_in', 'checked_out'] } } },
    {
      $lookup: {
        from: 'rooms',
        localField: 'room',
        foreignField: '_id',
        as: 'room'
      }
    },
    { $unwind: '$room' },
    { $group: { _id: '$room.type', revenue: { $sum: '$totalAmount' }, bookings: { $sum: 1 } } },
    { $project: { roomType: '$_id', revenue: 1, bookings: 1, _id: 0 } }
  ]);

  if (await sendExport(request, response, 'revenue-report', rows)) {
    return;
  }

  sendSuccess(response, rows, 'Revenue report fetched');
});

export const staffReport = asyncHandler(async (request: Request, response: Response) => {
  const rows = await HousekeepingTaskModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'staff'
      }
    },
    { $unwind: '$staff' },
    {
      $group: {
        _id: '$staff.name',
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        total: { $sum: 1 }
      }
    },
    { $project: { staffName: '$_id', completed: 1, total: 1, _id: 0 } }
  ]);

  if (await sendExport(request, response, 'staff-report', rows)) {
    return;
  }

  sendSuccess(response, rows, 'Staff report fetched');
});

export const guestReport = asyncHandler(async (request: Request, response: Response) => {
  const rows = await UserModel.aggregate([
    { $match: { role: 'guest' } },
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'guest',
        as: 'bookings'
      }
    },
    {
      $project: {
        guestName: '$name',
        email: '$email',
        stays: { $size: '$bookings' },
        lastStayAt: { $max: '$bookings.checkOut' }
      }
    },
    { $sort: { stays: -1, guestName: 1 } }
  ]);

  if (await sendExport(request, response, 'guest-report', rows)) {
    return;
  }

  sendSuccess(response, rows, 'Guest report fetched');
});
