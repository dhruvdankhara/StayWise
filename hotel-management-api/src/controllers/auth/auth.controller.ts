import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { env } from '../../config/env';
import { UserModel } from '../../models/User';
import { VerificationTokenModel } from '../../models/VerificationToken';
import { createAuditLog } from '../../services/audit.service';
import { generateToken, sendEmail } from '../../services/email.service';
import { sendSuccess } from '../../utils/api';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { signJwt } from '../../utils/tokens';

const buildAuthResponse = (user: { id: string; name: string; email: string; role: string; isVerified: boolean }) => ({
  user,
  token: signJwt({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  })
});

export const register = asyncHandler(async (request: Request, response: Response) => {
  const { name, email, phone, password } = request.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AppError(409, 'Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    phone,
    passwordHash,
    role: 'guest',
    isVerified: false
  });

  const token = generateToken();
  await VerificationTokenModel.create({
    user: user._id,
    token,
    type: 'email_verification',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
  });

  await sendEmail(
    email,
    'Verify your StayWise account',
    `<p>Welcome to StayWise, ${name}.</p><p>Use this token to verify your email: <strong>${token}</strong></p>`
  );

  await createAuditLog({
    actor: user.id,
    action: 'register',
    entity: 'user',
    entityId: user.id
  });

  sendSuccess(
    response,
    buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }),
    'Registration successful',
    201
  );
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new AppError(403, 'User account is inactive');
  }

  sendSuccess(
    response,
    buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }),
    'Login successful'
  );
});

export const verifyEmail = asyncHandler(async (request: Request, response: Response) => {
  const record = await VerificationTokenModel.findOne({
    token: request.body.token,
    type: 'email_verification'
  });

  if (!record) {
    throw new AppError(400, 'Invalid verification token');
  }

  const user = await UserModel.findByIdAndUpdate(record.user, { isVerified: true }, { new: true });
  await VerificationTokenModel.deleteOne({ _id: record._id });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  sendSuccess(response, { isVerified: true }, 'Email verified');
});

export const forgotPassword = asyncHandler(async (request: Request, response: Response) => {
  const user = await UserModel.findOne({ email: request.body.email });

  if (user) {
    const token = generateToken();
    await VerificationTokenModel.create({
      user: user._id,
      token,
      type: 'password_reset',
      expiresAt: new Date(Date.now() + 1000 * 60 * 30)
    });

    const resetUrl = `${env.CLIENT_URL}/auth/reset-password?token=${token}`;
    await sendEmail(
      user.email,
      'Reset your StayWise password',
      `<p>Reset your password using this link:</p><p>${resetUrl}</p><p>Token: <strong>${token}</strong></p>`
    );
  }

  sendSuccess(response, { sent: true }, 'If the account exists, a reset email has been sent');
});

export const resetPassword = asyncHandler(async (request: Request, response: Response) => {
  const { token, password } = request.body;
  const record = await VerificationTokenModel.findOne({ token, type: 'password_reset' });

  if (!record) {
    throw new AppError(400, 'Invalid reset token');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await UserModel.findByIdAndUpdate(record.user, { passwordHash });
  await VerificationTokenModel.deleteOne({ _id: record._id });

  sendSuccess(response, { updated: true }, 'Password updated successfully');
});

export const me = asyncHandler(async (request: Request, response: Response) => {
  const user = await UserModel.findById(request.user?.id).select('-passwordHash');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  sendSuccess(response, user, 'Current user profile');
});

export const updateMe = asyncHandler(async (request: Request, response: Response) => {
  const user = await UserModel.findByIdAndUpdate(request.user?.id, request.body, {
    new: true,
    runValidators: true
  }).select('-passwordHash');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  await createAuditLog({
    actor: request.user?.id,
    action: 'update_profile',
    entity: 'user',
    entityId: user.id
  });

  sendSuccess(response, user, 'Profile updated');
});
