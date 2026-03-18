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

// Receptionists can manage guests
guestRouter.get("/", requireRole("admin", "receptionist"), listGuests);

guestRouter.post(
  "/",
  requireRole("admin", "receptionist"),
  validate(createGuestSchema),
  createGuest,
);
