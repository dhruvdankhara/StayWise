import type { Request, Response } from 'express';

import { BookingModel } from '../../models/Booking';
import { ReviewModel } from '../../models/Review';
import { sendSuccess } from '../../utils/api';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';

export const listReviews = asyncHandler(async (_request: Request, response: Response) => {
  const reviews = await ReviewModel.find().populate('guest', 'name').populate('room', 'roomNumber type').sort({ createdAt: -1 });
  sendSuccess(response, reviews, 'Reviews fetched');
});

export const roomReviews = asyncHandler(async (request: Request, response: Response) => {
  const reviews = await ReviewModel.find({ room: request.params.roomId, isVisible: true })
    .populate('guest', 'name')
    .sort({ createdAt: -1 });

  sendSuccess(response, reviews, 'Room reviews fetched');
});

export const createReview = asyncHandler(async (request: Request, response: Response) => {
  const booking = await BookingModel.findById(request.body.bookingId);

  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  if (String(booking.guest) !== request.user?.id) {
    throw new AppError(403, 'You can only review your own stay');
  }

  if (booking.status !== 'checked_out') {
    throw new AppError(400, 'Reviews are only available after checkout');
  }

  const review = await ReviewModel.create({
    booking: request.body.bookingId,
    guest: request.user?.id,
    room: request.body.roomId,
    rating: request.body.rating,
    comment: request.body.comment,
    isVisible: true
  });

  sendSuccess(response, review, 'Review submitted', 201);
});

export const updateVisibility = asyncHandler(async (request: Request, response: Response) => {
  const review = await ReviewModel.findByIdAndUpdate(
    request.params.id,
    { isVisible: request.body.isVisible },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  sendSuccess(response, review, 'Review visibility updated');
});
