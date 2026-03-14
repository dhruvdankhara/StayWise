import { Schema, Types, model } from 'mongoose';

export interface ReviewDocument {
  booking: Types.ObjectId;
  guest: Types.ObjectId;
  room: Types.ObjectId;
  rating: number;
  comment?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    guest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    isVisible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ReviewModel = model<ReviewDocument>('Review', reviewSchema);
