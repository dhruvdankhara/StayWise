import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    roomId: z.string().min(1),
    assignedTo: z.string().min(1),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    notes: z.string().optional(),
    scheduledFor: z.string().datetime()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateTaskSchema = z.object({
  body: z.object({
    assignedTo: z.string().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    notes: z.string().optional(),
    scheduledFor: z.string().datetime().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'skipped']),
    notes: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) })
});
