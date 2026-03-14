import { z } from 'zod';

export const createRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1),
    type: z.enum(['single', 'double', 'suite', 'deluxe', 'family']),
    floor: z.number().int().min(0),
    capacity: z.number().int().min(1),
    baseRate: z.number().min(0),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string().url()).default([]),
    description: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateRoomSchema = z.object({
  body: createRoomSchema.shape.body.partial().extend({
    status: z.enum(['available', 'occupied', 'dirty', 'maintenance', 'out_of_order']).optional(),
    isActive: z.boolean().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});
