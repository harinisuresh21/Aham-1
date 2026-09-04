import express from 'express';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  updateFulfillmentInfo,
  addAdminNote,
} from '../controllers/adminOrderController.js';
import { requireAdminAuth, requireAdminRole } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER', 'SUPPORT'), getAdminOrders);
router.get('/:id', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER', 'SUPPORT'), getAdminOrderById);

router.patch('/:id/status', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER'), updateOrderStatus);
router.patch('/:id/fulfillment', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER'), updateFulfillmentInfo);
router.post('/:id/notes', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER', 'SUPPORT'), addAdminNote);

export default router;
