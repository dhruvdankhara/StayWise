import { Router } from 'express';

import { getSettings, updateSettings } from '../../controllers/settings/settings.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';
import { validate } from '../../middleware/validate';
import { updateSettingsSchema } from '../../validators/settings.validators';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, requireRole('admin'), validate(updateSettingsSchema), updateSettings);

export { router as settingsRouter };
