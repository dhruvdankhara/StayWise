import { Router } from "express";

import {
  analyticsSummary,
  guestReport,
  occupancyReport,
  revenueReport,
  staffReport,
} from "../../controllers/reports/reports.controller";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/roleCheck";

const router = Router();

router.use(requireAuth);
router.get("/summary", requireRole("admin"), analyticsSummary);
router.get("/occupancy", requireRole("admin"), occupancyReport);
router.get("/revenue", requireRole("admin"), revenueReport);
router.get("/staff", requireRole("admin"), staffReport);
router.get("/guests", requireRole("admin"), guestReport);

export { router as reportRouter };
