import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    address: z.string().min(5).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().min(8).optional(),
    logoUrl: z.string().url().optional(),
    invoiceFooter: z.string().optional(),
    currency: z.string().min(3).max(3).optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});
