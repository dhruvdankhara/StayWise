import { Router } from 'express';

import { upload } from '../../config/upload';
import { uploadAsset } from '../../controllers/uploads/uploads.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';

const router = Router();

router.post('/', requireAuth, requireRole('admin', 'hotel_manager'), upload.single('file'), uploadAsset);

export { router as uploadRouter };
