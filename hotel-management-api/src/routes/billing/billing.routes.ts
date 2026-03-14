import { Router } from 'express';

import {
  addCharge,
  createInvoice,
  downloadInvoicePdf,
  getInvoice,
  recordPayment
} from '../../controllers/billing/billing.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';
import { validate } from '../../middleware/validate';
import { extraChargeSchema, invoiceSchema, paymentSchema } from '../../validators/billing.validators';

const router = Router();

router.use(requireAuth);
router.get('/:bookingId', getInvoice);
router.post('/:bookingId', requireRole('admin', 'hotel_manager', 'receptionist'), validate(invoiceSchema), createInvoice);
router.put(
  '/:bookingId/charges',
  requireRole('admin', 'hotel_manager', 'receptionist'),
  validate(extraChargeSchema),
  addCharge
);
router.post(
  '/:bookingId/payment',
  requireRole('admin', 'hotel_manager', 'receptionist'),
  validate(paymentSchema),
  recordPayment
);
router.get('/:bookingId/pdf', downloadInvoicePdf);

export { router as billingRouter };
