import { Types } from 'mongoose';

import { BookingModel } from '../models/Booking';
import { RoomModel } from '../models/Room';
import { calculateNights } from '../utils/booking';
import { AppError } from '../utils/AppError';

export const ensureRoomAvailability = async (
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  ignoreBookingId?: string
): Promise<void> => {
  const overlappingBooking = await BookingModel.findOne({
    room: new Types.ObjectId(roomId),
    status: { $in: ['pending', 'confirmed', 'checked_in'] },
    ...(ignoreBookingId ? { _id: { $ne: new Types.ObjectId(ignoreBookingId) } } : {}),
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn }
  });

  if (overlappingBooking) {
    throw new AppError(400, 'Room is not available for the selected dates');
  }
};

export const calculateBookingAmount = async (roomId: string, checkIn: Date, checkOut: Date): Promise<number> => {
  const room = await RoomModel.findById(roomId);

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  return room.baseRate * calculateNights(checkIn, checkOut);
};

export const generateBookingReference = (): string =>
  `SW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
