import express from 'express';
import {
  getAdminCustomers,
  getAdminCustomerByEmail,
} from '../controllers/adminCustomerController.js';
import { requireAdminAuth, requireAdminRole } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER', 'SUPPORT'), getAdminCustomers);
router.get('/:email', requireAdminRole('SUPER_ADMIN', 'ORDER_MANAGER', 'SUPPORT'), getAdminCustomerByEmail);

export default router;
