import { Router } from "express";

import {
  createGuest,
  listGuests,
} from "../../controllers/guests/guests.controller";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/roleCheck";
import { validate } from "../../middleware/validate";
import { createGuestSchema } from "../../validators/guest.validators";

export const guestRouter = Router();

guestRouter.use(requireAuth);

// Receptionists and Hotel Managers can manage guests
guestRouter.get("/", requireRole("hotel_manager", "receptionist"), listGuests);

guestRouter.post(
  "/",
  requireRole("hotel_manager", "receptionist"),
  validate(createGuestSchema),
  createGuest,
);
