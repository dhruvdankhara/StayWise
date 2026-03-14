import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    password: z.string().min(8)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    password: z.string().min(8)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(10)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    profileImage: z.string().url().optional(),
    preferences: z.record(z.string(), z.unknown()).optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});
