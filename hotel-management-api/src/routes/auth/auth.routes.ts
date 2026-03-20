import { Router } from "express";

import {
  forgotPassword,
  login,
  me,
  register,
  resetPassword,
  uploadProfileImage,
  updateMe,
  verifyEmail,
} from "../../controllers/auth/auth.controller";
import { upload } from "../../config/upload";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from "../../validators/auth.validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", requireAuth, me);
router.put("/me", requireAuth, validate(updateProfileSchema), updateMe);
router.post(
  "/me/profile-image",
  requireAuth,
  upload.single("file"),
  uploadProfileImage,
);

export { router as authRouter };
