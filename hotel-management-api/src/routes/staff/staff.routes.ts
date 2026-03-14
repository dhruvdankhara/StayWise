import { Router } from 'express';

import {
  createStaff,
  deactivateStaff,
  listStaff,
  updateStaff
} from '../../controllers/staff/staff.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';
import { validate } from '../../middleware/validate';
import { createStaffSchema, updateStaffSchema } from '../../validators/staff.validators';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/', listStaff);
router.post('/', validate(createStaffSchema), createStaff);
router.put('/:id', validate(updateStaffSchema), updateStaff);
router.delete('/:id', deactivateStaff);

export { router as staffRouter };
