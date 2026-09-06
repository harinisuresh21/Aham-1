import express from 'express';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../controllers/adminCategoryController.js';
import { requireAdminAuth, requireAdminRole } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Apply admin auth to all category routes
router.use(requireAdminAuth);

router
  .route('/')
  .get(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), getAdminCategories)
  .post(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), createAdminCategory);

router
  .route('/:id')
  .put(requireAdminRole('SUPER_ADMIN', 'CATALOG_MANAGER'), updateAdminCategory)
  .delete(requireAdminRole('SUPER_ADMIN'), deleteAdminCategory);

export default router;
