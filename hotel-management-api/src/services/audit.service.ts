import { Types } from 'mongoose';

import { AuditLogModel } from '../models/AuditLog';

export const createAuditLog = async (input: {
  actor?: string;
  action: string;
  entity: string;
  entityId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> => {
  await AuditLogModel.create({
    actor: input.actor ? new Types.ObjectId(input.actor) : undefined,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    reason: input.reason,
    metadata: input.metadata
  });
};
