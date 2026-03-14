import { Router } from 'express';

import {
  createTask,
  listTasks,
  updateTask,
  updateTaskStatus
} from '../../controllers/housekeeping/housekeeping.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';
import { validate } from '../../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema
} from '../../validators/housekeeping.validators';

const router = Router();

router.use(requireAuth);
router.get('/', requireRole('admin', 'hotel_manager', 'receptionist', 'cleaning_staff'), listTasks);
router.post('/', requireRole('admin', 'hotel_manager', 'receptionist'), validate(createTaskSchema), createTask);
router.put('/:id', requireRole('admin', 'hotel_manager', 'receptionist'), validate(updateTaskSchema), updateTask);
router.patch('/:id/status', requireRole('cleaning_staff', 'admin', 'hotel_manager', 'receptionist'), validate(updateTaskStatusSchema), updateTaskStatus);

export { router as housekeepingRouter };
