import { z } from "zod";

export const createGuestSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
  }),
});
