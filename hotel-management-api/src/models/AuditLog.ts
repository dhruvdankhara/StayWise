import { Schema, Types, model } from 'mongoose';

export interface AuditLogDocument {
  actor?: Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const AuditLogModel = model<AuditLogDocument>('AuditLog', auditLogSchema);
