import { Schema, Types, model } from 'mongoose';

export interface VerificationTokenDocument {
  user: Types.ObjectId;
  token: string;
  type: 'email_verification' | 'password_reset';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationTokenSchema = new Schema<VerificationTokenDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    type: { type: String, enum: ['email_verification', 'password_reset'], required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationTokenModel = model<VerificationTokenDocument>('VerificationToken', verificationTokenSchema);
