import { z } from 'zod';

export const invoiceSchema = z.object({
  body: z.object({
    lineItems: z
      .array(
        z.object({
          description: z.string().min(1),
          quantity: z.number().min(1),
          unitPrice: z.number().min(0)
        })
      )
      .min(1),
    taxRate: z.number().min(0),
    discount: z.number().min(0).default(0),
    discountReason: z.string().optional()
  }),
  params: z.object({ bookingId: z.string().min(1) }),
  query: z.object({}).optional()
});

export const extraChargeSchema = z.object({
  body: z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0)
  }),
  params: z.object({ bookingId: z.string().min(1) }),
  query: z.object({}).optional()
});

export const paymentSchema = z.object({
  body: z.object({
    amount: z.number().min(1),
    method: z.enum(['cash', 'card', 'upi', 'online']),
    providerPaymentId: z.string().optional()
  }),
  params: z.object({ bookingId: z.string().min(1) }),
  query: z.object({}).optional()
});
