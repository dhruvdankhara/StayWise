import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    guestId: z.string().optional(),
    roomId: z.string().min(1),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    guests: z.number().int().min(1),
    specialRequests: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateBookingSchema = z.object({
  body: z.object({
    roomId: z.string().optional(),
    checkIn: z.string().datetime().optional(),
    checkOut: z.string().datetime().optional(),
    guests: z.number().int().min(1).optional(),
    specialRequests: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});

export const cancelBookingSchema = z.object({
  body: z.object({
    reason: z.string().min(3)
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});
