import express from 'express';
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from '../controllers/adminCouponController.js';
import { requireAdminAuth, requireAdminRole } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.use(requireAdminAuth);

router
  .route('/')
  .get(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), getAdminCoupons)
  .post(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), createAdminCoupon);

router
  .route('/:id')
  .put(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), updateAdminCoupon)
  .delete(requireAdminRole('SUPER_ADMIN'), deleteAdminCoupon);

export default router;
