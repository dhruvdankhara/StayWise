import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    roomId: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateReviewVisibilitySchema = z.object({
  body: z.object({
    isVisible: z.boolean()
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});
