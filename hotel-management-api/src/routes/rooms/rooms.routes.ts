import { Router } from 'express';

import {
  availableRooms,
  createRoom,
  deleteRoom,
  getRoom,
  listRooms,
  updateRoom
} from '../../controllers/rooms/rooms.controller';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleCheck';
import { validate } from '../../middleware/validate';
import { createRoomSchema, updateRoomSchema } from '../../validators/room.validators';

const router = Router();

router.get('/', listRooms);
router.get('/available', availableRooms);
router.get('/:id', getRoom);
router.post('/', requireAuth, requireRole('admin'), validate(createRoomSchema), createRoom);
router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  validate(updateRoomSchema),
  updateRoom
);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRoom);

export { router as roomRouter };
