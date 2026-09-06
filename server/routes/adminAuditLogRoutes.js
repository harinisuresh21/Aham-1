import express from 'express';
import { getAdminAuditLogs } from '../controllers/adminAuditLogController.js';
import { requireAdminAuth, requireAdminRole } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();
router.use(requireAdminAuth);

router.get('/', requireAdminRole('SUPER_ADMIN'), getAdminAuditLogs);

export default router;
