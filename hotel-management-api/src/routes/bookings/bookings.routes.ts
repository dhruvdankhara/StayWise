import { Router } from "express";

import {
  cancelBooking,
  checkIn,
  checkOut,
  createBooking,
  getBooking,
  listBookings,
  listMyBookings,
  updateBooking,
} from "../../controllers/bookings/bookings.controller";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/roleCheck";
import { validate } from "../../middleware/validate";
import {
  cancelBookingSchema,
  createBookingSchema,
  updateBookingSchema,
} from "../../validators/booking.validators";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("admin", "hotel_manager", "receptionist"),
  listBookings,
);
router.get("/my", requireAuth, requireRole("guest"), listMyBookings);
router.get("/:id", requireAuth, getBooking);
router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "hotel_manager", "receptionist"),
  validate(updateBookingSchema),
  updateBooking,
);
router.post("/:id/checkin", requireAuth, requireRole("receptionist"), checkIn);
router.post(
  "/:id/checkout",
  requireAuth,
  requireRole("receptionist"),
  checkOut,
);
router.post(
  "/:id/cancel",
  requireAuth,
  validate(cancelBookingSchema),
  cancelBooking,
);

export { router as bookingRouter };
