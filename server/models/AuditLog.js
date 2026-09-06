import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      enum: ['AUTH', 'PRODUCTS', 'CATEGORIES', 'ORDERS', 'CUSTOMERS', 'COUPONS', 'SETTINGS', 'ADMIN_USERS'],
    },
    resourceId: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for audit log querying & reporting
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ adminId: 1 });
auditLogSchema.index({ resource: 1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
