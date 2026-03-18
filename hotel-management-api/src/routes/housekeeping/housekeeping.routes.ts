import { Router } from "express";

import {
  createTask,
  deleteTask,
  listTasks,
  listAssignableStaff,
  updateTask,
  updateTaskStatus,
} from "../../controllers/housekeeping/housekeeping.controller";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/roleCheck";
import { validate } from "../../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../../validators/housekeeping.validators";

const router = Router();

router.use(requireAuth);
router.get(
  "/",
  requireRole("admin", "receptionist", "cleaning_staff"),
  listTasks,
);
router.get(
  "/assignees",
  requireRole("admin", "receptionist"),
  listAssignableStaff,
);
router.post(
  "/",
  requireRole("admin", "receptionist"),
  validate(createTaskSchema),
  createTask,
);
router.put(
  "/:id",
  requireRole("admin", "receptionist"),
  validate(updateTaskSchema),
  updateTask,
);
router.delete("/:id", requireRole("admin", "receptionist"), deleteTask);
router.patch(
  "/:id/status",
  requireRole("cleaning_staff", "admin", "receptionist"),
  validate(updateTaskStatusSchema),
  updateTaskStatus,
);

export { router as housekeepingRouter };
