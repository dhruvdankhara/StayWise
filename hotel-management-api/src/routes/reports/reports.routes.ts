import { Router } from 'express';

import {
  guestReport,
  occupancyReport,
  revenueReport,
  staffReport
} from '../../controllers/reports/reports.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';

const router = Router();

router.use(requireAuth);
router.get('/occupancy', requireRole('admin', 'hotel_manager'), occupancyReport);
router.get('/revenue', requireRole('admin', 'hotel_manager'), revenueReport);
router.get('/staff', requireRole('admin'), staffReport);
router.get('/guests', requireRole('admin'), guestReport);

export { router as reportRouter };
