import { Router } from "express";

import { authRouter } from "./auth/auth.routes";
import { billingRouter } from "./billing/billing.routes";
import { bookingRouter } from "./bookings/bookings.routes";
import { guestRouter } from "./guests/guests.routes";
import { housekeepingRouter } from "./housekeeping/housekeeping.routes";
import { reportRouter } from "./reports/reports.routes";
import { reviewRouter } from "./reviews/reviews.routes";
import { roomRouter } from "./rooms/rooms.routes";
import { settingsRouter } from "./settings/settings.routes";
import { staffRouter } from "./staff/staff.routes";
import { uploadRouter } from "./uploads/uploads.routes";

const router = Router();

router.get("/", (_request, response) => {
  response.json({
    success: true,
    data: {
      name: "StayWise API",
      version: "1.0.0",
    },
  });
});

router.use("/auth", authRouter);
router.use("/rooms", roomRouter);
router.use("/bookings", bookingRouter);
router.use("/guests", guestRouter);
router.use("/staff", staffRouter);
router.use("/billing", billingRouter);
router.use("/housekeeping", housekeepingRouter);
router.use("/reports", reportRouter);
router.use("/reviews", reviewRouter);
router.use("/settings", settingsRouter);
router.use("/uploads", uploadRouter);

export const apiRouter = router;
