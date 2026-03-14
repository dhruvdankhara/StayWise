import type { Request, Response } from 'express';

import { RoomModel } from '../../models/Room';
import { sendSuccess } from '../../utils/api';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { getPagination } from '../../utils/pagination';

export const listRooms = asyncHandler(async (request: Request, response: Response) => {
  const { limit, page, skip } = getPagination(request.query as Record<string, unknown>);
  const filters: Record<string, unknown> = { isActive: true };

  if (request.query.type) {
    filters.type = request.query.type;
  }

  if (request.query.status) {
    filters.status = request.query.status;
  }

  if (request.query.capacity) {
    filters.capacity = { $gte: Number(request.query.capacity) };
  }

  const [items, total] = await Promise.all([
    RoomModel.find(filters).sort({ floor: 1, roomNumber: 1 }).skip(skip).limit(limit),
    RoomModel.countDocuments(filters)
  ]);

  sendSuccess(response, {
    items,
    page,
    limit,
    total
  }, 'Rooms fetched');
});

export const availableRooms = asyncHandler(async (request: Request, response: Response) => {
  const { checkIn, checkOut, type, guests } = request.query;

  if (!checkIn || !checkOut) {
    throw new AppError(400, 'checkIn and checkOut are required');
  }

  const occupiedRoomIds = await (await import('../../models/Booking')).BookingModel.find({
    status: { $in: ['pending', 'confirmed', 'checked_in'] },
    checkIn: { $lt: new Date(String(checkOut)) },
    checkOut: { $gt: new Date(String(checkIn)) }
  }).distinct('room');

  const filters: Record<string, unknown> = {
    isActive: true,
    status: 'available',
    _id: { $nin: occupiedRoomIds }
  };

  if (type) {
    filters.type = type;
  }

  if (guests) {
    filters.capacity = { $gte: Number(guests) };
  }

  const rooms = await RoomModel.find(filters).sort({ baseRate: 1 });
  sendSuccess(response, rooms, 'Available rooms fetched');
});

export const getRoom = asyncHandler(async (request: Request, response: Response) => {
  const room = await RoomModel.findById(request.params.id);

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  sendSuccess(response, room, 'Room fetched');
});

export const createRoom = asyncHandler(async (request: Request, response: Response) => {
  const room = await RoomModel.create(request.body);
  sendSuccess(response, room, 'Room created', 201);
});

export const updateRoom = asyncHandler(async (request: Request, response: Response) => {
  const room = await RoomModel.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true
  });

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  sendSuccess(response, room, 'Room updated');
});

export const deleteRoom = asyncHandler(async (request: Request, response: Response) => {
  const room = await RoomModel.findByIdAndUpdate(
    request.params.id,
    { isActive: false },
    { new: true, runValidators: true }
  );

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  sendSuccess(response, room, 'Room deactivated');
});
