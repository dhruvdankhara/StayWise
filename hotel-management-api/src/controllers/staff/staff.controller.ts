import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { UserModel } from '../../models/User';
import { sendSuccess } from '../../utils/api';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';

export const listStaff = asyncHandler(async (_request: Request, response: Response) => {
  const staff = await UserModel.find({ role: { $ne: 'guest' } }).select('-passwordHash').sort({ createdAt: -1 });
  sendSuccess(response, staff, 'Staff members fetched');
});

export const createStaff = asyncHandler(async (request: Request, response: Response) => {
  const existing = await UserModel.findOne({ email: request.body.email });

  if (existing) {
    throw new AppError(409, 'Email is already in use');
  }

  const passwordHash = await bcrypt.hash(request.body.password, 10);
  const staff = await UserModel.create({
    name: request.body.name,
    email: request.body.email,
    phone: request.body.phone,
    role: request.body.role,
    passwordHash,
    isVerified: true
  });

  sendSuccess(response, { ...staff.toObject(), passwordHash: undefined }, 'Staff account created', 201);
});

export const updateStaff = asyncHandler(async (request: Request, response: Response) => {
  const staff = await UserModel.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true
  }).select('-passwordHash');

  if (!staff) {
    throw new AppError(404, 'Staff member not found');
  }

  sendSuccess(response, staff, 'Staff account updated');
});

export const deactivateStaff = asyncHandler(async (request: Request, response: Response) => {
  const staff = await UserModel.findByIdAndUpdate(
    request.params.id,
    { isActive: false },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!staff) {
    throw new AppError(404, 'Staff member not found');
  }

  sendSuccess(response, staff, 'Staff account deactivated');
});
