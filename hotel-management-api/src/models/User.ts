import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

import { roles, type Role } from '../constants/enums';

export interface UserDocument {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  preferences?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String },
    preferences: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const UserModel = model<UserDocument>('User', userSchema);
