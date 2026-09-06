import express from 'express';
import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  updateStockQuantity,
  deleteAdminProduct,
} from '../controllers/adminProductController.js';
import { requireAdminAuth, requireAdminRole } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Protect all product routes with admin auth
router.use(requireAdminAuth);

router
  .route('/')
  .get(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), getAdminProducts)
  .post(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), createAdminProduct);

router
  .route('/:id')
  .get(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), getAdminProductById)
  .put(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), updateAdminProduct)
  .delete(requireAdminRole('SUPER_ADMIN'), deleteAdminProduct);

router.patch('/:id/stock', requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER', 'ORDER_MANAGER'), updateStockQuantity);

export default router;
