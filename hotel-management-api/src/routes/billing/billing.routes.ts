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
  requireRole("guest", "admin", "hotel_manager", "receptionist"),
  validate(createOnlineOrderSchema),
  createOnlineOrder,
);
router.post(
  "/online/verify",
  requireRole("guest", "admin", "hotel_manager", "receptionist"),
  validate(verifyOnlinePaymentSchema),
  verifyOnlinePayment,
);
router.get("/:bookingId", getInvoice);
router.post(
  "/:bookingId",
  requireRole("admin", "hotel_manager", "receptionist"),
  validate(invoiceSchema),
  createInvoice,
);
router.put(
  "/:bookingId/charges",
  requireRole("admin", "hotel_manager", "receptionist"),
  validate(extraChargeSchema),
  addCharge,
);
router.post(
  "/:bookingId/payment",
  requireRole("admin", "hotel_manager", "receptionist"),
  validate(paymentSchema),
  recordPayment,
);
router.get("/:bookingId/pdf", downloadInvoicePdf);

export { router as billingRouter };
