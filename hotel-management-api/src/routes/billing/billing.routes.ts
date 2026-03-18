import { Router } from "express";

import {
  addCharge,
  createOnlineOrder,
  createInvoice,
  downloadInvoicePdf,
  getInvoice,
  recordPayment,
  verifyOnlinePayment,
} from "../../controllers/billing/billing.controller";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/roleCheck";
import { validate } from "../../middleware/validate";
import {
  createOnlineOrderSchema,
  extraChargeSchema,
  invoiceSchema,
  paymentSchema,
  verifyOnlinePaymentSchema,
} from "../../validators/billing.validators";

const router = Router();

router.use(requireAuth);
router.post(
  "/online/order",
  requireRole("guest", "admin", "receptionist"),
  validate(createOnlineOrderSchema),
  createOnlineOrder,
);
router.post(
  "/online/verify",
  requireRole("guest", "admin", "receptionist"),
  validate(verifyOnlinePaymentSchema),
  verifyOnlinePayment,
);
router.get("/:bookingId", getInvoice);
router.post(
  "/:bookingId",
  requireRole("admin", "receptionist"),
  validate(invoiceSchema),
  createInvoice,
);
router.put(
  "/:bookingId/charges",
  requireRole("admin", "receptionist"),
  validate(extraChargeSchema),
  addCharge,
);
router.post(
  "/:bookingId/payment",
  requireRole("admin", "receptionist"),
  validate(paymentSchema),
  recordPayment,
);
router.get("/:bookingId/pdf", downloadInvoicePdf);

export { router as billingRouter };
