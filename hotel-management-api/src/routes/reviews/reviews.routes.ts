import { Router } from 'express';

import {
  createReview,
  listReviews,
  roomReviews,
  updateVisibility
} from '../../controllers/reviews/reviews.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';
import { validate } from '../../middleware/validate';
import { createReviewSchema, updateReviewVisibilitySchema } from '../../validators/review.validators';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), listReviews);
router.get('/room/:roomId', roomReviews);
router.post('/', requireAuth, requireRole('guest'), validate(createReviewSchema), createReview);
router.patch(
  '/:id/visibility',
  requireAuth,
  requireRole('admin'),
  validate(updateReviewVisibilitySchema),
  updateVisibility
);

export { router as reviewRouter };
