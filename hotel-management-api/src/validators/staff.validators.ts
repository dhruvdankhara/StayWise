import { z } from 'zod';

export const createStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    password: z.string().min(8),
    role: z.enum(['hotel_manager', 'receptionist', 'cleaning_staff'])
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).optional(),
    role: z.enum(['hotel_manager', 'receptionist', 'cleaning_staff']).optional(),
    isActive: z.boolean().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});
